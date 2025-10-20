"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signTransaction,
  getAddress,
  getNetworkDetails,
} from "@stellar/freighter-api";
import {
  buildMintTxXdr,
  getContractId,
  getTotals,
  submitTx,
} from "@/lib/soroban";

type NetworkDetails = {
  networkUrl: string;
  networkPassphrase: string;
  sorobanRpcUrl?: string;
};

const truncateKey = (key: string) => `${key.slice(0, 4)}...${key.slice(-4)}`;

export default function MainPage() {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("1");
  const [recipient, setRecipient] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [lastOwner, setLastOwner] = useState<string>("-");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CONTRACT_ID = getContractId() || "";

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("publicKey") : null;
    if (!saved) {
      router.push("/");
      return;
    }
    setPublicKey(saved);
    setRecipient(saved);
  }, [router]);

  const readTotals = async () => {
    console.log("📊 Reading totals...");
    const remote = await getTotals();
    if (remote) {
      console.log("✅ Totals loaded:", remote);
      setTotal(remote.total);
      setLastOwner(remote.lastOwner || "N/A");
    } else {
      console.log("⚠️ Failed to load totals");
    }
  };

  const mint = async () => {
    setError(null);
    setBusy(true);
    
    try {
      console.log("🎫 Starting mint process...");
      
      if (!publicKey) throw new Error("Not connected");
      if (!CONTRACT_ID)
        throw new Error("Set NEXT_PUBLIC_SOROBAN_CONTRACT_ID in .env.local");

      console.log("🔗 Getting network details...");
      const details = (await getNetworkDetails()) as NetworkDetails;
      console.log("Network:", details.networkPassphrase);

      console.log("👤 Getting address...");
      const addressResult = await getAddress();
      const address = addressResult.address || publicKey;
      console.log("Address:", address);

      const finalRecipient = recipient || address;
      const finalAmount = Number(amount || 1);

      console.log("📝 Building XDR with params:", {
        publicKey: address,
        recipient: finalRecipient,
        amount: finalAmount,
      });

      const xdr = await buildMintTxXdr({
        publicKey: address,
        recipient: finalRecipient,
        amount: finalAmount,
      });

      if (!xdr) {
        throw new Error("Failed to build transaction XDR. Check API logs.");
      }

      console.log("✅ XDR built, length:", xdr.length);
      console.log("✍️ Signing transaction...");

      const signed = await signTransaction(xdr, {
        networkPassphrase: details.networkPassphrase,
        address,
      });

      console.log("✅ Transaction signed");
      console.log("📤 Submitting transaction...");

      const result = await submitTx(signed.signedTxXdr);

      console.log("✅ Transaction submitted:", result);

      // Wait a bit before reading totals
      setTimeout(() => readTotals(), 2000);

      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Minting failed";
      console.error("❌ Mint error:", e);
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    readTotals();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">TicketChain</h1>
          <button
            onClick={() => {
              localStorage.removeItem("publicKey");
              router.push("/");
            }}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Disconnect
          </button>
        </div>

        <div className="mb-6 p-3 rounded-lg bg-gray-100 text-center">
          <p className="text-sm font-medium text-gray-600">Connected Account</p>
          <p className="font-mono text-sm text-gray-800 break-all mt-1">
            {publicKey ? truncateKey(publicKey) : "Loading..."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Recipient Wallet Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="G..."
            />
          </div>

          <button
            disabled={busy}
            onClick={mint}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            {busy ? "Minting..." : "Mint Ticket"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-8 border-t-2 border-dashed pt-6 space-y-4">
          <div className="flex items-center justify-between text-md">
            <span className="font-medium text-gray-600">Total Tickets Minted</span>
            <span className="font-bold text-xl text-gray-900">{total}</span>
          </div>
          <div className="flex flex-col text-md">
            <span className="font-medium text-gray-600 mb-1">Last Ticket Owner</span>
            <span className="font-mono text-xs text-gray-700 break-all bg-gray-100 p-2 rounded-md">
              {lastOwner !== "-" && lastOwner !== "N/A" ? truncateKey(lastOwner) : lastOwner}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}