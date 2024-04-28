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

const transferSolana=async (senderKeypair, receiverPublicKey, amount)=>{
  // 创建交易指令
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: receiverPublicKey,
      lamports: amount * LAMPORTS_PER_SOL, // 将 SOL 转换为 lamports
    })
  )

  // 签署并发送交易
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ])
  return signature
}

// 定义一个异步函数来请求空投
async function requestAirdrop(publicKey) {
  console.log(`Requesting airdrop to wallet: ${publicKey}`);

  // 请求空投
  const airdropSignature = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL // 1 SOL
  );

  // 确认交易
  await connection.confirmTransaction(airdropSignature, 'confirmed');
  console.log('Airdrop successful!');

  // 获取并打印新的余额
  const balance = await connection.getBalance(publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

try {
  const { blockhash } = await connection.getLatestBlockhash('finalized')
  console.log(blockhash)

  // const senderSecretKey = base58.decode()
  const senderKeypair = Keypair.fromSecretKey(senderSecretKey)
  // const publicKey = new PublicKey();
  // await requestAirdrop(publicKey)
  const res=await transferSolana(senderKeypair, publicKey, 0.01)
  console.log(res);
} catch (e) {
  console.log(e)
}

