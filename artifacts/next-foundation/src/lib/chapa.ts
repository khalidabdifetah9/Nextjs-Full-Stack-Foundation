const BASE = "https://api.chapa.global";

function authHeaders() {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) throw new Error("CHAPA_SECRET_KEY is not set.");
  return { Authorization: `Bearer ${key}` };
}

interface HostedInput {
  idempotencyKey: string;
  amount: number; // cents
  currency: string;
  merchantReference: string;
  returnUrl: string;
  title: string;
  description: string;
  customer: { first_name: string; last_name: string; email: string; phone_number?: string };
  meta: Record<string, string>;
}

export async function createHostedCheckout(input: HostedInput) {
  const res = await fetch(`${BASE}/v2/payments/hosted`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      merchant_reference: input.merchantReference,
      return_url: input.returnUrl,
      customer: input.customer,
      meta: input.meta,
      customization: { title: input.title, description: input.description },
    }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || json?.status !== "success" || !json?.data?.checkout_url) {
    console.error("Chapa initialize failed:", res.status, json);
    throw new Error(json?.message ?? "Could not start the payment.");
  }

  const checkoutUrl: string = json.data.checkout_url;
  // The last part of the checkout URL is Chapa's own payment reference
  const chapaReference = checkoutUrl.split("/").filter(Boolean).pop() ?? null;
  return { checkoutUrl, chapaReference };
}

export interface ChapaPayment {
  chapa_reference: string;
  merchant_reference: string;
  amount: number;
  currency: string;
  status: string; // SUCCESS | PENDING | FAILED | CANCELLED | INCOMPLETE | BLOCKED
  payment_method?: string;
  service_fee?: number;
}

export async function verifyPayment(reference: string): Promise<ChapaPayment | null> {
  const res = await fetch(`${BASE}/v2/payments/${encodeURIComponent(reference)}/verify`, {
    cache: "no-store",
    headers: authHeaders(),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // warn, not error: a pending payment isn't a crash, so no red overlay
    console.warn("Chapa verify not ok:", reference, res.status, JSON.stringify(json));
    return null;
  }
  return (json?.data as ChapaPayment) ?? null;
}