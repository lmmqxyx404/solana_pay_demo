import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import base58 from 'bs58'

const network = WalletAdapterNetwork.Testnet
const endpoint = clusterApiUrl(network)
const connection = new Connection(endpoint)
console.log(connection)
try {
  const { blockhash } = await connection.getLatestBlockhash('finalized')
  console.log(blockhash)

  const senderSecretKey = base58.decode()
  const senderKeypair = Keypair.fromSecretKey(senderSecretKey)
  const receiverPublicKey = new PublicKey()

  // 创建交易指令
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: receiverPublicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL, // 将 SOL 转换为 lamports
    })
  )

  // 签署并发送交易

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ])
  console.log(signature)
} catch (e) {
  console.log(e)
}
