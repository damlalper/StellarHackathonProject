
// This file is the client-side interface for interacting with our Soroban API route.
// It makes fetch requests to the backend, which handles the Stellar SDK logic.

type Totals = { total: number; lastOwner: string | null };

// A helper function to handle POST requests to our API
async function postSorobanApi(method: string, params: Record<string, any> = {}) {
  const response = await fetch("/api/soroban", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, params }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "An API error occurred");
  }

  return data;
}

/**
 * Fetches the contract ID from environment variables.
 * @returns The contract ID or null if not set.
 */
export function getContractId(): string | null {
  return process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || null;
}

/**
 * Reads total tickets and the last owner from the contract via the API.
 * @returns An object with total and lastOwner, or null on error.
 */
export async function getTotals(): Promise<Totals | null> {
  try {
    return await postSorobanApi("getTotals");
  } catch (e) {
    console.error("Error fetching totals:", e);
    return null;
  }
}

/**
 * Builds the XDR for the 'mint_ticket' transaction via the API.
 * @param params - The public key of the sender, recipient, and amount.
 * @returns A base64-encoded XDR string or null on error.
 */
export async function buildMintTxXdr(params: {
  publicKey: string;
  recipient: string;
  amount: number;
}): Promise<string | null> {
  try {
    const { xdr } = await postSorobanApi("buildMintTxXdr", params);
    return xdr;
  } catch (e) {
    console.error("Error building XDR:", e);
    return null;
  }
}

/**
 * Submits a signed transaction to the network via the API.
 * @param signedXdr The base64-encoded signed XDR.
 * @returns The transaction response.
 */
export async function submitTx(signedXdr: string) {
  try {
    return await postSorobanApi("submitTx", { signedXdr });
  } catch (e) {
    console.error("Error submitting transaction:", e);
    throw e;
  }
}
