// app/page.tsx
'use client'; // This is a client component
import { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction, clusterApiUrl, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';


import '@solana/wallet-adapter-react-ui/styles.css' // Import styles
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import useConnectWallet from '@/customhook/useConnectWallet';
// import { useConnectWallet } from '@web3-onboard/react';
// const connection = useConnection();

const network = WalletAdapterNetwork.Mainnet; // Or Mainnet-beta
const endpoint = clusterApiUrl(network);

const Home: FC = () => {
    const { publicKey, connected, sendTransaction } = useWallet();
    const connectWallet = useConnectWallet();
    const [publicKeyValue, setPublicKey] = useState<PublicKey | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        console.log(connected);
        setIsConnected(connected)
    }, [connected])


    useEffect(() => {
        async function fetchBalance() {
            if (publicKeyValue) {
                try {
                    const connection = new Connection(endpoint);
                    const balance = await connection.getBalance(publicKeyValue);
                    setBalance(balance);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                    setBalance(null);
                }
            }
        }

        fetchBalance();
    }, [publicKeyValue]);


    const handleSendTransaction = async () => {
        if (!publicKey || !sendTransaction) {
            alert("Please connect your wallet.");
            return;
        }

        try {
            const connection = new Connection(endpoint);

            const toPublicKey = new PublicKey("AoPHkETmAueYFVz9fk4Jsf6gVKntm8KCr1SmnbE1YQQx"); // Replace with the recipient's public key

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: toPublicKey,
                    lamports: 0.0052 * LAMPORTS_PER_SOL, // 0.1 SOL
                })
            );

            const signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature, 'processed');

            // setTxSignature(signature);
            console.log(signature);

            console.log('Transaction confirmed', signature);
            alert("Transaction sent successfully!");
            // Optionally refresh the balance after a successful transaction
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance);

        } catch (error) {
            console.error("Error sending transaction:", error);
            alert("Error sending transaction: " + error);
        }
    };

    console.log(isConnected)
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Solana Wallet Connection</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="mb-4">Connect your Solana wallet to view your balance.</p>
                <ConnectButton setPublicKey={setPublicKey} connected={connected} publicKey={publicKey} connectWallet={connectWallet} />
                {
                    isConnected && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleSendTransaction()}
                        >
                            send
                        </button>
                    )
                }
                {publicKey && (
                    <div className="mt-4">
                        <p>
                            <strong>Public Key:</strong> {publicKey.toBase58()}
                        </p>
                        {balance !== null ? (
                            <p>
                                <strong>Balance:</strong> {balance / 1000000000} SOL bala
                            </p>
                        ) : (
                            <p>Fetching balance...</p>
                        )}
                    </div>
                )}
                {!publicKey && <p className="text-gray-500 mt-2">No wallet connected.</p>}
            </div>
        </main>

    );
}

export default Home;

// ConnectButton component (same as before)
interface ConnectButtonProps {
    setPublicKey: (publicKey: PublicKey | null) => void;
    connectWallet: () => void;
    publicKey: PublicKey | null;
    connected: boolean;
}

const ConnectButton: FC<ConnectButtonProps> = ({ setPublicKey, publicKey, connected, connectWallet }) => {


    useEffect(() => {
        setPublicKey(publicKey);
    }, [publicKey]);

    return (
        <>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => connectWallet()}
                disabled={connected}
            >
                {connected ? 'Connected' : 'Connect Wallet'}

            </button>

        </>
    );
};
