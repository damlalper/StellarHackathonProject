import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const StellarSdk = await import("stellar-sdk");
    const body = await request.json();
    const { method, params } = body;

    console.log("📥 API Request:", { method, params });

    const contractId = process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID;
    if (!contractId) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SOROBAN_CONTRACT_ID is not set" },
        { status: 500 }
      );
    }

    const sorobanServer = new StellarSdk.rpc.Server(
      "https://soroban-testnet.stellar.org"
    );

    switch (method) {
      // ======================================================
      // GET TOTALS
      // ======================================================
      case "getTotals": {
        const contract = new StellarSdk.Contract(contractId);
        const dummyAccount = new StellarSdk.Account(
          "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          "0"
        );

        // --- Total tickets ---
        const totalTx = new StellarSdk.TransactionBuilder(dummyAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(contract.call("get_total_tickets"))
          .setTimeout(30)
          .build();

        const totalSim = await sorobanServer.simulateTransaction(totalTx);
        if (totalSim.error) {
          console.error("❌ Total simulation error:", totalSim.error);
          return NextResponse.json({ total: 0, lastOwner: null });
        }

        // Bazı versiyonlarda result.retval yerine result.returnValue gelir
        const totalVal =
          totalSim.result?.retval ?? totalSim.result?.returnValue ?? null;
        const total = totalVal
          ? StellarSdk.scValToNative(totalVal)
          : 0;

        // --- Last owner ---
        const ownerTx = new StellarSdk.TransactionBuilder(dummyAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(contract.call("get_last_ticket_owner"))
          .setTimeout(30)
          .build();

        const ownerSim = await sorobanServer.simulateTransaction(ownerTx);
        if (ownerSim.error) {
          console.error("❌ Owner simulation error:", ownerSim.error);
        }

        const ownerVal =
          ownerSim.result?.retval ?? ownerSim.result?.returnValue ?? null;
        const lastOwner = ownerVal
          ? StellarSdk.scValToNative(ownerVal)
          : null;

        console.log("✅ getTotals success:", { total, lastOwner });
        return NextResponse.json({ total, lastOwner });
      }

      // ======================================================
      // BUILD MINT TX XDR
      // ======================================================
      case "buildMintTxXdr": {
        const { publicKey, recipient, amount } = params;
        if (!publicKey || !recipient || amount === undefined) {
          return NextResponse.json(
            { error: "Missing required parameters: publicKey, recipient, amount" },
            { status: 400 }
          );
        }

        const contract = new StellarSdk.Contract(contractId);
        const sourceAccount = await sorobanServer.getAccount(publicKey);
        console.log("✅ Account loaded:", sourceAccount.sequence);

        const recipientAddress = new StellarSdk.Address(recipient);
        const amountScVal = StellarSdk.nativeToScVal(amount, { type: "u32" });

        const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            contract.call("mint_ticket", recipientAddress.toScVal(), amountScVal)
          )
          .setTimeout(180)
          .build();

        const preparedTx = await sorobanServer.prepareTransaction(tx);
        const xdr = preparedTx.toXDR();

        console.log("✅ XDR built successfully");
        return NextResponse.json({ xdr });
      }

      // ======================================================
      // SUBMIT TX
      // ======================================================
      case "submitTx": {
        const { signedXdr } = params;
        if (!signedXdr) {
          return NextResponse.json({ error: "signedXdr is required" }, { status: 400 });
        }

        const tx = StellarSdk.TransactionBuilder.fromXDR(
          signedXdr,
          StellarSdk.Networks.TESTNET
        );

        const response = await sorobanServer.sendTransaction(tx);

        console.log("📤 TX sent:", response);

        // Bazı durumlarda status yok ama errorResult veya error olur
        if (response.error || response.status === "ERROR") {
          const err =
            response.errorResult?.toString() ||
            response.error ||
            "Unknown transaction error";
          console.error("❌ TX Error:", err);
          return NextResponse.json({ error: err }, { status: 500 });
        }

        return NextResponse.json({
          status: response.status ?? "SUCCESS",
          hash: response.hash ?? null,
        });
      }

      // ======================================================
      // DEFAULT
      // ======================================================
      default:
        return NextResponse.json(
          { error: `Unknown method: ${method}` },
          { status: 400 }
        );
    }
  } catch (e) {
    console.error("❌ API Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
