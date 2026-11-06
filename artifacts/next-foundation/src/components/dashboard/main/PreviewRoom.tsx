"use client";

import { useState } from "react";
import { houses } from "@/lib/houses";
import PanoramaViewer from "./PanoramaViewer";
import ColorBar from "./ColorBar";
import HouseDetails from "./HouseDetails";
import HouseSelector from "./HouseSelector";
import RoomChips from "./RoomChips";

export default function PreviewRoom() {
  const [houseId, setHouseId] = useState(houses[0].id);
  const [roomId, setRoomId] = useState(houses[0].rooms[0].id);
  const [color, setColor] = useState<string | null>(null);
  const [strength, setStrength] = useState(0.85);

  const house = houses.find((h) => h.id === houseId) ?? houses[0];
  const room = house.rooms.find((r) => r.id === roomId) ?? house.rooms[0];

  // Only show hotspots whose destination room actually exists
  const hotspots = room.hotspots.filter((h) => house.rooms.some((r) => r.id === h.to));

  function selectHouse(id: string) {
    const next = houses.find((h) => h.id === id);
    if (!next) return;
    setHouseId(id);
    setRoomId(next.rooms[0].id);
  }

  function goToRoom(id: string) {
    if (house.rooms.some((r) => r.id === id)) setRoomId(id);
  }

  return (
    <div className="mx-auto max-w-400 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-wide text-[#243D35]/60">
            Preview Room
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Walk through your space
          </h1>
        </div>
        <p className="text-sm text-[#243D35]/70">
          {house.name} · {room.name}
        </p>
      </header>

      <ColorBar
        color={color}
        strength={strength}
        disabled={!room.mask}
        onColorChange={setColor}
        onStrengthChange={setStrength}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="order-2 xl:order-2 xl:sticky xl:top-8 xl:self-start">
          <HouseDetails house={house} />
        </div>
        <div className="order-1 h-[55vh] min-h-85 min-w-0 md:h-[62vh] xl:order-1 xl:h-[calc(100vh-17rem)] xl:min-h-110">
          <PanoramaViewer
            sceneKey={`${house.id}:${room.id}`}
            panorama={room.panorama}
            mask={room.mask}
            hotspots={hotspots}
            startPitch={room.startPitch}
            startYaw={room.startYaw}
            color={color}
            strength={strength}
            onNavigate={goToRoom}
            overlay={
              <RoomChips rooms={house.rooms} activeId={room.id} onSelect={goToRoom} />
            }
          />
        </div>

      </div>

      <HouseSelector houses={houses} activeId={house.id} onSelect={selectHouse} />
    </div>
  );
}