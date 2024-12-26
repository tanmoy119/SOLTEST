import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
// import { fetchUserDetails, registerUser } from "@/network/users";
// import { login, setUser } from "@/redux/reducers/AuthReducer";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function useConnectWallet() {
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const { visible, setVisible } = useWalletModal();
  const { connected, signMessage } = useWallet();
  // const dispatch = useAppDispatch();
  // const { token, user } = useAppSelector((state) => state.Auth);
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setVisible(true);
    },
  });
  const address = publicKey?.toBase58() ?? "";
  const handleSignMessage = async () => {
    if (signMessage) {
      const message = `Sign in to ceres at ${timestamp};`;
      const messageBytes = Buffer.from(message, "utf-8");
      try {
        const signature = await signMessage(messageBytes);
        const signatureBase64 = Buffer.from(signature).toString("base64");
        console.log(signature, signatureBase64);
        const requestBody = {
          loginType: "wallet",
          walletAddress: address,
          timestamp,
          signature: signatureBase64,
        };
        // const response = await registerUser(requestBody);
        // if (response && response.code == 200) {
        // dispatch(
        //   login({ token: response.accessToken, user: response.userData })
        // );
        // }
        // console.log(response);
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }
  };
  const onConnectClick = () => {
    switch (buttonState) {
      case "no-wallet":
        setVisible(true);
        break;
      case "has-wallet":
        if (onConnect) {
          onConnect();
        }
        break;
    }
  };
  useEffect(() => {
    const handleButtonStateChange = async () => {
      if (buttonState === "has-wallet") {
        if (onConnect) {
          onConnect();
        }
      }
      if (buttonState === "connected" || connected) {
        //  verify Token
        // if (token) {
        //   const response = await fetchUserDetails(address);
        //   console.log(response, address);
        //   if (response && response.data) {
        //     // dispatch(setUser(response.data));
        //     return;
        //   }
        // }
        handleSignMessage();
      }
    };
    handleButtonStateChange();
  }, [buttonState]);
  return onConnectClick;
}
