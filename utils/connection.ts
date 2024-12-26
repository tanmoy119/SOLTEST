// utils/connection.ts
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const network = WalletAdapterNetwork.Mainnet; // Set to Mainnet
const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || clusterApiUrl(network);

const makeRpcRequest = async (method: string, params: any[] = []) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const apiUrl = `${baseUrl}/api/solana-rpc`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `RPC request failed with status ${response.status}: ${errorText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error in makeRpcRequest:", error);
    throw error; // Re-throw the error
  }
};

let connection: Connection | null = null;

export const getConnection = () => {
  if (connection) {
    return connection;
  }

  if (typeof window !== "undefined") {
    if (network === WalletAdapterNetwork.Mainnet) {
      connection = new Connection("http://placeholder", {
        fetch: (url, options) => {
          const parsedBody = options?.body
            ? JSON.parse(options.body as string)
            : null;
          return makeRpcRequest(
            parsedBody?.method,
            parsedBody?.params
          ) as Promise<Response>;
        },
      });
    } else {
      connection = new Connection(endpoint);
    }
  } else {
    console.warn("Connection cannot be created on the server.");
  }

  return connection;
};

export const getNetwork = () => network;
export const getEndpoint = () => endpoint;
