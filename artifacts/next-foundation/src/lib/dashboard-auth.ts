export type DashboardSessionResponse = {
  status: number;
  ok: boolean;
};

export async function requireDashboardSession(
  validateSession: () => Promise<DashboardSessionResponse>,
  redirectTo: (path: string) => never,
): Promise<void> {
  const response = await validateSession();

  if (response.status === 401) {
    redirectTo("/signin");
  }

  if (!response.ok) {
    throw new Error(`Unable to validate dashboard session (${response.status}).`);
  }
}
