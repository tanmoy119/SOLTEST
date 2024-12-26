// app/api/solana-rpc/route.ts
import { NextResponse } from "next/server";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export async function POST(request: Request) {
  try {
    const connection = new Connection(clusterApiUrl("mainnet-beta")); // Or your preferred endpoint
    const { signature } = await request.json();

    console.log("Received signature:", signature);

    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed", // Or 'finalized', 'processed', etc.
      maxSupportedTransactionVersion: 0,
    });

    console.log("Transaction response:", transaction);

    if (!transaction) {
      console.log("Transaction not found on chain");
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
