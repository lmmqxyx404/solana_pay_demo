import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import BackLink from "../components/BackLink";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Loading from "../components/Loading";
import { Keypair } from "@solana/web3.js";

export default function Checkout() {
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();

  const [message, setMessage] = useState<string | null>(null);

  /** 1. Read the URL query (which includes our chosen products)  */
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(router.query)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v);
        }
      } else {
        searchParams.append(key, value);
      }
    }
  }

  // 2. Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // 3. Add it to the params we'll pass to the API */
  searchParams.append('reference', reference.toString());
  /** 4. Use our API to fetch the transaction for the selected items */
  

  if (!publicKey) {
    return (
      <div className='flex flex-col items-center gap-8'>
        <div><BackLink href='/'>Cancel</BackLink></div>

        <WalletMultiButton />

        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center gap-8'>
      <div><BackLink href='/'>Cancel</BackLink></div>

      <WalletMultiButton />

      {message ?
        <p>{message} Please approve the transaction using your wallet</p> :
        <p>Creating transaction... <Loading /></p>
      }
    </div>
  )
}