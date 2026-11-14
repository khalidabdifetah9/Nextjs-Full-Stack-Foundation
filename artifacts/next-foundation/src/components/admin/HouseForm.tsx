"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createHouse, updateHouse } from "@/actions/admin";
import { slugify } from "@/lib/admin-schema";
import type { HouseData } from "@/lib/admin-schema";
import ImageField from "./ImageField";

/* ---------- types ---------- */

interface HotspotState {
  uid: string;
  to: string; // the uid of the destination room
  label: string;
  pitch: string;
  yaw: string;
}

interface RoomState {
  uid: string;
  slug: string; // empty for new rooms, created when saving
  name: string;
  panoramaKey: string | null;
  maskKey: string | null;
  startPitch: string;
  startYaw: string;
  hotspots: HotspotState[];
}

interface FormState {
  name: string;
  type: string;
  status: "For Sale" | "For Rent";
  location: string;
  price: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  garage: string;
  yearBuilt: string;
  lotSize: string;
  description: string;
  featuresText: string; // one feature per line
  thumbKey: string | null;
  published: boolean;
  rooms: RoomState[];
}

/* ---------- helpers ---------- */

const uid = () => Math.random().toString(36).slice(2, 9);

const newRoom = (): RoomState => ({
  uid: uid(),
  slug: "",
  name: "",
  panoramaKey: null,
  maskKey: null,
  startPitch: "",
  startYaw: "",
  hotspots: [],
});

function toState(h?: HouseData): FormState {
  return {
    name: h?.name ?? "",
    type: h?.type ?? "",
    status: h?.status ?? "For Sale",
    location: h?.location ?? "",
    price: h ? String(h.price) : "",
    sqft: h ? String(h.sqft) : "",
    bedrooms: h ? String(h.bedrooms) : "",
    bathrooms: h ? String(h.bathrooms) : "",
    garage: h?.garage ?? "",
    yearBuilt: h?.yearBuilt ? String(h.yearBuilt) : "",
    lotSize: h?.lotSize ?? "",
    description: h?.description ?? "",
    featuresText: h?.features.join("\n") ?? "",
    // If the thumbnail is just the first room's image, treat it as "not set"
    thumbKey: h && h.thumbKey !== h.rooms[0]?.panoramaKey ? h.thumbKey ?? null : null,
    published: h?.published ?? true,
    rooms: h
      ? h.rooms.map((r) => ({
          uid: r.slug,
          slug: r.slug,
          name: r.name,
          panoramaKey: r.panoramaKey,
          maskKey: r.maskKey ?? null,
          startPitch: r.startPitch == null ? "" : String(r.startPitch),
          startYaw: r.startYaw == null ? "" : String(r.startYaw),
          hotspots: r.hotspots.map((s) => ({
            uid: uid(),
            to: s.to,
            label: s.label,
            pitch: String(s.pitch),
            yaw: String(s.yaw),
          })),
        }))
      : [newRoom()],
  };
}

const whole = (s: string) => (s.trim() !== "" && Number.isInteger(Number(s)) ? Number(s) : null);
const decimal = (s: string) => (s.trim() !== "" && Number.isFinite(Number(s)) ? Number(s) : null);

// Checks the form and turns it into the data the server expects
function buildPayload(f: FormState, id: string): { data: HouseData } | { error: string } {
  if (!f.name.trim()) return { error: "Enter the home's name." };
  if (!f.type.trim()) return { error: "Enter the home's type (for example Apartment)." };
  if (!f.location.trim()) return { error: "Enter the location." };

  const price = whole(f.price);
  const sqft = whole(f.sqft);
  const bedrooms = whole(f.bedrooms);
  const bathrooms = whole(f.bathrooms);
  if (price === null || price <= 0) return { error: "Enter a valid price (whole numbers only)." };
  if (sqft === null || sqft <= 0) return { error: "Enter the area in sqft." };
  if (bedrooms === null || bedrooms < 0) return { error: "Enter the number of bedrooms (0 or more)." };
  if (bathrooms === null || bathrooms < 0) return { error: "Enter the number of bathrooms (0 or more)." };

  const year = f.yearBuilt.trim() ? whole(f.yearBuilt) : null;
  if (f.yearBuilt.trim() && year === null) return { error: "Enter a valid year built." };

  // Give every new room a unique ID made from its name
  const used = new Set(f.rooms.map((r) => r.slug).filter(Boolean));
  const slugOf = new Map<string, string>();
  for (const r of f.rooms) {
    let s = r.slug;
    if (!s) {
      const base = slugify(r.name).length >= 2 ? slugify(r.name) : "room";
      s = base;
      let n = 2;
      while (used.has(s)) s = `${base}-${n++}`;
      used.add(s);
    }
    slugOf.set(r.uid, s);
  }

  const rooms: HouseData["rooms"] = [];
  for (const [i, r] of f.rooms.entries()) {
    const label = r.name.trim() || `Room ${i + 1}`;
    if (!r.name.trim()) return { error: `Enter a name for room ${i + 1}.` };
    if (!r.panoramaKey) return { error: `Upload the 360° image for "${label}".` };

    const hotspots: HouseData["rooms"][number]["hotspots"] = [];
    for (const h of r.hotspots) {
      const to = slugOf.get(h.to);
      const pitch = decimal(h.pitch);
      const yaw = decimal(h.yaw);
      if (!to) return { error: `Choose where each hotspot in "${label}" leads to.` };
      if (pitch === null || yaw === null) return { error: `Enter pitch and yaw for every hotspot in "${label}".` };
      const destName = f.rooms.find((x) => x.uid === h.to)?.name.trim() ?? "";
      hotspots.push({ to, label: h.label.trim() || destName || "Next room", pitch, yaw });
    }

    rooms.push({
      slug: slugOf.get(r.uid)!,
      name: r.name.trim(),
      panoramaKey: r.panoramaKey,
      maskKey: r.maskKey,
      startPitch: decimal(r.startPitch),
      startYaw: decimal(r.startYaw),
      hotspots,
    });
  }

  return {
    data: {
      id,
      name: f.name.trim(),
      type: f.type.trim(),
      status: f.status,
      location: f.location.trim(),
      price,
      sqft,
      bedrooms,
      bathrooms,
      garage: f.garage.trim(),
      yearBuilt: year,
      lotSize: f.lotSize.trim(),
      description: f.description.trim(),
      features: f.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      thumbKey: f.thumbKey,
      published: f.published,
      rooms,
    },
  };
}

/* ---------- small UI pieces ---------- */

const fieldClass =
  "w-full rounded-md border border-[#243D35]/20 bg-white px-4 py-3 text-base text-[#243D35] placeholder:text-[#243D35]/40 outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#243D35]/15";

const smallBtn =
  "rounded-md border border-[#243D35]/20 px-4 py-2 text-sm font-medium transition hover:border-[#243D35] disabled:cursor-not-allowed disabled:opacity-40";

function Section({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 sm:p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {text && <p className="mt-1 text-sm text-[#243D35]/60">{text}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-[#243D35]/50">{hint}</p>}
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <input
        id={id}
        type={type}
        min={type === "number" ? 0 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
    </Field>
  );
}

/* ---------- the form ---------- */

export default function HouseForm({ initial }: { initial?: HouseData }) {
  const router = useRouter();
  const editing = Boolean(initial);

  // The home's ID is fixed while editing; a new home gets a private draft ID
  // so uploads have a place to go before it is saved.
  const [houseId] = useState(() => initial?.id ?? `home-${Math.random().toString(36).slice(2, 8)}`);

  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [busy, setBusy] = useState(0); // how many images are uploading
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const trackBusy = (b: boolean) => setBusy((n) => n + (b ? 1 : -1));

  /* rooms */
  const updateRoom = (roomUid: string, patch: Partial<RoomState>) =>
    setForm((f) => ({ ...f, rooms: f.rooms.map((r) => (r.uid === roomUid ? { ...r, ...patch } : r)) }));

  const addRoom = () => setForm((f) => ({ ...f, rooms: [...f.rooms, newRoom()] }));

  const removeRoom = (roomUid: string) =>
    setForm((f) => ({
      ...f,
      rooms: f.rooms
        .filter((r) => r.uid !== roomUid)
        // hotspots that led to the removed room are removed too
        .map((r) => ({ ...r, hotspots: r.hotspots.filter((h) => h.to !== roomUid) })),
    }));

  /* hotspots */
  const addHotspot = (roomUid: string) =>
    setForm((f) => ({
      ...f,
      rooms: f.rooms.map((r) =>
        r.uid === roomUid
          ? { ...r, hotspots: [...r.hotspots, { uid: uid(), to: "", label: "", pitch: "-4", yaw: "0" }] }
          : r
      ),
    }));

  const updateHotspot = (roomUid: string, hotspotUid: string, patch: Partial<HotspotState>) =>
    setForm((f) => ({
      ...f,
      rooms: f.rooms.map((r) =>
        r.uid === roomUid
          ? { ...r, hotspots: r.hotspots.map((h) => (h.uid === hotspotUid ? { ...h, ...patch } : h)) }
          : r
      ),
    }));

  const removeHotspot = (roomUid: string, hotspotUid: string) =>
    setForm((f) => ({
      ...f,
      rooms: f.rooms.map((r) =>
        r.uid === roomUid ? { ...r, hotspots: r.hotspots.filter((h) => h.uid !== hotspotUid) } : r
      ),
    }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving || busy > 0) return;
    setError("");

    const built = buildPayload(form, houseId);
    if ("error" in built) {
      setError(built.error);
      return;
    }

    setSaving(true);
    const result = editing ? await updateHouse(built.data) : await createHouse(built.data);

    if ("error" in result) {
      setSaving(false);
      setError(result.error);
      return;
    }

    router.push("/dashboard/admin");
    router.refresh();
  }

  const roomLabel = (r: RoomState, i: number) => r.name.trim() || `Room ${i + 1}`;
  const errorBox = error && (
    <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  );

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {errorBox}

      {/* 1. Details */}
      <Section title="Home details" text="The information users see next to the 360° preview.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="name" label="Name" value={form.name} onChange={(v) => set({ name: v })} placeholder="Bole Haven Residence" />
          <TextField id="type" label="Type" value={form.type} onChange={(v) => set({ type: v })} placeholder="Apartment" />

          <Field label="Status" htmlFor="status">
            <select
              id="status"
              value={form.status}
              onChange={(e) => set({ status: e.target.value as FormState["status"] })}
              className={fieldClass}
            >
              <option>For Sale</option>
              <option>For Rent</option>
            </select>
          </Field>
          <TextField
            id="price"
            type="number"
            label="Price (ETB)"
            value={form.price}
            onChange={(v) => set({ price: v })}
            hint={form.status === "For Rent" ? "Price per month." : "Full price."}
          />

          <TextField id="location" label="Location" value={form.location} onChange={(v) => set({ location: v })} placeholder="Bole, Addis Ababa, Ethiopia" />
          <TextField id="sqft" type="number" label="Area (sqft)" value={form.sqft} onChange={(v) => set({ sqft: v })} />

          <TextField id="bedrooms" type="number" label="Bedrooms" value={form.bedrooms} onChange={(v) => set({ bedrooms: v })} />
          <TextField id="bathrooms" type="number" label="Bathrooms" value={form.bathrooms} onChange={(v) => set({ bathrooms: v })} />

          <TextField id="garage" label="Garage / parking" value={form.garage} onChange={(v) => set({ garage: v })} placeholder="2 cars" />
          <TextField id="year" type="number" label="Year built (optional)" value={form.yearBuilt} onChange={(v) => set({ yearBuilt: v })} />

          <TextField id="lot" label="Lot size" value={form.lotSize} onChange={(v) => set({ lotSize: v })} placeholder="250 m²" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Field label="Description" htmlFor="description">
              <textarea
                id="description"
                rows={5}
                maxLength={2000}
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
                className={`${fieldClass} resize-none`}
              />
            </Field>
            <Field label="Features" htmlFor="features" hint="One feature per line.">
              <textarea
                id="features"
                rows={4}
                value={form.featuresText}
                onChange={(e) => set({ featuresText: e.target.value })}
                placeholder={"Balcony\nSecure parking"}
                className={`${fieldClass} resize-none`}
              />
            </Field>
          </div>

          <ImageField
            label="Thumbnail (optional)"
            hint="Small card image. If you skip it, the first room's image is used."
            kind="thumb"
            houseId={houseId}
            value={form.thumbKey}
            onChange={(k) => set({ thumbKey: k })}
            onBusyChange={trackBusy}
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set({ published: e.target.checked })}
            className="h-4 w-4 accent-[#243D35]"
          />
          Show this home to users
        </label>
      </Section>

      {/* 2. Rooms */}
      <Section
        title="Rooms"
        text="Each room needs one 360° image (a 2:1 JPG or PNG, for example 4096×2048). The wall mask is optional and only needed for color changes."
      >
        <div className="space-y-5">
          {form.rooms.map((room, i) => {
            const others = form.rooms.filter((o) => o.uid !== room.uid);

            return (
              <div key={room.uid} className="space-y-5 rounded-xl border border-[#243D35]/15 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Room {i + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeRoom(room.uid)}
                    disabled={form.rooms.length === 1}
                    className={`${smallBtn} text-red-600`}
                  >
                    Remove room
                  </button>
                </div>

                <TextField
                  id={`room-${room.uid}`}
                  label="Room name"
                  value={room.name}
                  onChange={(v) => updateRoom(room.uid, { name: v })}
                  placeholder="Living Room"
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <ImageField
                    label="360° image (required)"
                    hint="Must be 2:1, for example 4096×2048."
                    kind="panorama"
                    houseId={houseId}
                    value={room.panoramaKey}
                    onChange={(k) => updateRoom(room.uid, { panoramaKey: k })}
                    onBusyChange={trackBusy}
                  />
                  <ImageField
                    label="Wall mask (optional)"
                    hint="White = paintable walls, black = everything else. Same size as the 360° image."
                    kind="mask"
                    houseId={houseId}
                    value={room.maskKey}
                    onChange={(k) => updateRoom(room.uid, { maskKey: k })}
                    onBusyChange={trackBusy}
                  />
                </div>

                {/* Hotspots */}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold">Hotspots</h4>
                    <button
                      type="button"
                      onClick={() => addHotspot(room.uid)}
                      disabled={others.length === 0}
                      className={smallBtn}
                    >
                      + Add hotspot
                    </button>
                  </div>

                  {others.length === 0 && (
                    <p className="mt-2 text-xs text-[#243D35]/50">
                      Add another room to link rooms together with arrows.
                    </p>
                  )}

                  {room.hotspots.length > 0 && (
                    <>
                      <ul className="mt-3 space-y-3">
                        {room.hotspots.map((h) => (
                          <li key={h.uid} className="grid gap-3 sm:grid-cols-[1.2fr_1fr_90px_90px_auto] sm:items-end">
                            <Field label="Leads to">
                              <select
                                value={h.to}
                                onChange={(e) => updateHotspot(room.uid, h.uid, { to: e.target.value })}
                                className={fieldClass}
                              >
                                <option value="">Choose a room</option>
                                {others.map((o) => (
                                  <option key={o.uid} value={o.uid}>
                                    {roomLabel(o, form.rooms.indexOf(o))}
                                  </option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Label">
                              <input
                                value={h.label}
                                onChange={(e) => updateHotspot(room.uid, h.uid, { label: e.target.value })}
                                placeholder="Kitchen"
                                className={fieldClass}
                              />
                            </Field>
                            <Field label="Pitch">
                              <input
                                type="number"
                                step="any"
                                value={h.pitch}
                                onChange={(e) => updateHotspot(room.uid, h.uid, { pitch: e.target.value })}
                                className={fieldClass}
                              />
                            </Field>
                            <Field label="Yaw">
                              <input
                                type="number"
                                step="any"
                                value={h.yaw}
                                onChange={(e) => updateHotspot(room.uid, h.uid, { yaw: e.target.value })}
                                className={fieldClass}
                              />
                            </Field>
                            <button
                              type="button"
                              onClick={() => removeHotspot(room.uid, h.uid)}
                              aria-label="Remove hotspot"
                              className={`${smallBtn} py-3 text-red-600`}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-[#243D35]/50">
                        Yaw: 0 is the center of the image, positive goes right. Pitch: 0 is the horizon, negative goes
                        down. Save, preview the home, then adjust the numbers until the arrow sits on the doorway.
                      </p>
                    </>
                  )}
                </div>

                {/* Starting view */}
                <details>
                  <summary className="cursor-pointer text-sm font-medium">Starting view (optional)</summary>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`yaw-${room.uid}`}
                      type="number"
                      label="Start yaw"
                      value={room.startYaw}
                      onChange={(v) => updateRoom(room.uid, { startYaw: v })}
                      hint="Which direction the viewer faces first."
                    />
                    <TextField
                      id={`pitch-${room.uid}`}
                      type="number"
                      label="Start pitch"
                      value={room.startPitch}
                      onChange={(v) => updateRoom(room.uid, { startPitch: v })}
                    />
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={addRoom} className={`${smallBtn} mt-5`}>
          + Add another room
        </button>
      </Section>

      {/* 3. Save */}
      {errorBox}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard/admin"
          className="rounded-md border border-[#243D35]/20 px-6 py-3.5 text-center text-base font-medium transition hover:border-[#243D35]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving || busy > 0}
          className="rounded-md bg-[#243D35] px-8 py-3.5 text-base font-medium text-white transition hover:bg-[#1a2d27] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy > 0 ? "Uploading images..." : saving ? "Saving..." : editing ? "Save changes" : "Create home"}
        </button>
      </div>
    </form>
  );
}