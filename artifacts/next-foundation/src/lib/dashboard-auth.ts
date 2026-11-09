export type DashboardSessionResponse = {
  status: number;
  ok: boolean;
};

export async function requireVerifiedDashboardSession(
  validateSession: () => Promise<DashboardSessionResponse>,
  redirectTo: (path: string) => never,
): Promise<void> {
  const response = await validateSession();

  if (response.status === 401) {
    redirectTo("/signin");
  }

  if (response.status === 403) {
    redirectTo("/verify-email");
  }

  if (!response.ok) {
    throw new Error(`Unable to validate dashboard session (${response.status}).`);
  }
}
