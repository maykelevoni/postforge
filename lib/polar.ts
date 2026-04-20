interface CreatePolarCheckoutParams {
  polarApiKey: string;
  amount: number;
  clientEmail?: string;
  ticketId: string;
  serviceName: string;
}

interface PolarCheckoutResult {
  checkoutUrl: string;
  checkoutId: string;
}

export async function createPolarCheckout(
  params: CreatePolarCheckoutParams
): Promise<PolarCheckoutResult> {
  const { polarApiKey, amount, clientEmail, ticketId, serviceName } = params;

  const body: Record<string, unknown> = {
    amount,
    currency: "usd",
    metadata: { ticketId, serviceName },
  };
  if (clientEmail) {
    body.customer_email = clientEmail;
  }

  const res = await fetch("https://api.polar.sh/v1/checkouts/custom", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${polarApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Polar API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return { checkoutUrl: data.url, checkoutId: data.id };
}
