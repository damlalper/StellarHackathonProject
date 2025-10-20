"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isConnected as freighterIsConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";

export default function Home() {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("publicKey") : null;
    if (saved) setPublicKey(saved);
  }, []);

  const handleConnect = async () => {
    setError(null);
    setLoading(true);
    try {
      const { isConnected } = await freighterIsConnected();
      if (!isConnected) {
        setError("Freighter not detected. Please install the extension.");
        setLoading(false);
        return;
      }

      const { address, error } = await requestAccess();
      if (error) throw new Error(error);

      const key = address ?? (await getAddress()).address ?? null;
      if (!key) throw new Error("Unable to get public key");

      setPublicKey(key);
      localStorage.setItem("publicKey", key);
      router.push("/main");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    if (typeof window !== "undefined") localStorage.removeItem("publicKey");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">TicketChain</h1>
        <p className="text-gray-500">Connect your Freighter wallet to continue.</p>

        {publicKey ? (
          <div className="space-y-4">
            <p className="break-all text-sm text-gray-700">Connected: {publicKey}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/main")}
                className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-black/80"
              >
                Go to app
              </button>
              <button
                onClick={handleDisconnect}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-black/80 disabled:opacity-60"
          >
            {loading ? "Connecting..." : "Connect Freighter"}
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
