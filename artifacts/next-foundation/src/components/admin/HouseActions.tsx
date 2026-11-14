"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHouse, setPublished } from "@/actions/admin";

interface Props {
  id: string;
  name: string;
  published: boolean;
}

const btn =
  "rounded-md border border-[#243D35]/20 px-4 py-2 text-sm font-medium transition hover:border-[#243D35] disabled:opacity-50";

export default function HouseActions({ id, name, published }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    const result = await setPublished(id, !published);
    setBusy(false);
    if ("error" in result) setError(result.error);
    else router.refresh();
  }

  async function remove() {
    if (!window.confirm(`Delete "${name}"? This also deletes its images and can't be undone.`)) return;
    setBusy(true);
    setError("");
    const result = await deleteHouse(id);
    setBusy(false);
    if ("error" in result) setError(result.error);
    else router.refresh();
  }

  return (
    <>
      <button type="button" onClick={toggle} disabled={busy} className={btn}>
        {published ? "Hide" : "Publish"}
      </button>
      <button type="button" onClick={remove} disabled={busy} className={`${btn} text-red-600`}>
        Delete
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </>
  );
}