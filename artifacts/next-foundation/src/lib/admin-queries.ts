import { and, asc, count, desc, eq, gt, gte, inArray, sql } from "drizzle-orm";
import {
  appointments,
  db,
  houseRooms,
  houses,
  orders,
  reservations,
  roomHotspots,
  user,
} from "@workspace/db";
import type { HouseData } from "./admin-schema";
import { mediaUrl } from "./media-url";
import { getAdminSession } from "./admin";
import { expireStaleReservations } from "./payments";
import { businessNow, fromKey, toKey } from "./schedule";

export async function getAdminActivity() {
  if (!(await getAdminSession())) throw new Error("Not allowed.");

  await expireStaleReservations();

  const today = businessNow().date;
  const next = fromKey(today);
  next.setDate(next.getDate() + 1);
  const tomorrow = toKey(next);
  const now = Date.now();

  const [meetings, holds, payments, [revenue]] = await Promise.all([
    db
      .select({
        id: appointments.id,
        date: appointments.date,
        time: appointments.time,
        topic: appointments.topic,
        note: appointments.note,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
      .from(appointments)
      .innerJoin(user, eq(user.id, appointments.userId))
      .where(and(eq(appointments.status, "booked"), gte(appointments.date, today)))
      .orderBy(asc(appointments.date), asc(appointments.time)),

    db
      .select({
        id: reservations.id,
        days: reservations.days,
        endsAt: reservations.endsAt,
        houseName: houses.name,
        name: user.name,
        email: user.email,
        phone: user.phone,
        amount: orders.amount,
        ref: orders.merchantReference,
      })
      .from(reservations)
      .innerJoin(user, eq(user.id, reservations.userId))
      .innerJoin(houses, eq(houses.id, reservations.houseId))
      .innerJoin(
        orders,
        and(eq(orders.reservationId, reservations.id), eq(orders.status, "SUCCESS")),
      )
      .where(and(eq(reservations.status, "active"), gt(reservations.endsAt, new Date())))
      .orderBy(asc(reservations.endsAt)),

    db
      .select({
        id: orders.id,
        ref: orders.merchantReference,
        amount: orders.amount,
        paidAt: orders.paidAt,
        name: user.name,
        email: user.email,
        houseName: houses.name,
      })
      .from(orders)
      .innerJoin(user, eq(user.id, orders.userId))
      .innerJoin(reservations, eq(reservations.id, orders.reservationId))
      .innerJoin(houses, eq(houses.id, reservations.houseId))
      .where(eq(orders.status, "SUCCESS"))
      .orderBy(desc(orders.paidAt))
      .limit(10),

    db
      .select({ total: sql<string>`coalesce(sum(${orders.amount}), 0)` })
      .from(orders)
      .where(eq(orders.status, "SUCCESS")),
  ]);

  return {
    today,
    tomorrow,
    meetings,
    holds: holds.map((h) => ({
      ...h,
      daysLeft: h.endsAt
        ? Math.max(1, Math.ceil((h.endsAt.getTime() - now) / 86_400_000))
        : 0,
    })),
    payments,
    revenue: Number(revenue.total),
  };
}

export async function getAdminHouses() {
  if (!(await getAdminSession())) throw new Error("Not allowed.");

  const rows = await db
    .select({
      id: houses.id,
      name: houses.name,
      status: houses.status,
      location: houses.location,
      price: houses.price,
      published: houses.published,
      thumb: houses.thumb,
      rooms: count(houseRooms.id),
    })
    .from(houses)
    .leftJoin(houseRooms, eq(houseRooms.houseId, houses.id))
    .groupBy(houses.id)
    .orderBy(asc(houses.createdAt), asc(houses.id));

  return rows.map((r) => ({ ...r, thumbUrl: mediaUrl(r.thumb) }));
}

export async function getHouseForEdit(id: string): Promise<HouseData | null> {
  if (!(await getAdminSession())) throw new Error("Not allowed.");

  const [h] = await db.select().from(houses).where(eq(houses.id, id)).limit(1);
  if (!h) return null;

  const rooms = await db
    .select()
    .from(houseRooms)
    .where(eq(houseRooms.houseId, id))
    .orderBy(asc(houseRooms.position));

  // Only load hotspots for this house's rooms (the old code loaded every hotspot in the table)
  const spots =
    rooms.length > 0
      ? await db
          .select()
          .from(roomHotspots)
          .where(
            inArray(
              roomHotspots.roomId,
              rooms.map((r) => r.id),
            ),
          )
      : [];

  return {
    id: h.id,
    name: h.name,
    type: h.type,
    status: h.status,
    location: h.location,
    price: h.price,
    sqft: h.sqft,
    bedrooms: h.bedrooms,
    bathrooms: h.bathrooms,
    garage: h.garage ?? "",
    yearBuilt: h.yearBuilt,
    lotSize: h.lotSize ?? "",
    description: h.description ?? "",
    features: h.features,
    thumbKey: h.thumb,
    published: h.published,
    rooms: rooms.map((r) => ({
      slug: r.slug,
      name: r.name,
      panoramaKey: r.panoramaKey,
      maskKey: r.maskKey,
      startPitch: r.startPitch,
      startYaw: r.startYaw,
      hotspots: spots
        .filter((s) => s.roomId === r.id)
        .map((s) => ({ to: s.toSlug, label: s.label, pitch: s.pitch, yaw: s.yaw })),
    })),
  };
}