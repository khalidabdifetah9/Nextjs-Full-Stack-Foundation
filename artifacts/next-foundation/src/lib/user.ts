export const DASHBOARD_TITLE = "Verified Home Explorer";

export interface SidebarUser {
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]!.toUpperCase())
      .join("") || "U"
  );
}

