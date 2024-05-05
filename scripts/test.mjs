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
import { private_keys } from './private_key.mjs'

const transferSolana = async (senderKeypair, receiverPublicKey, amount) => {
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
  console.log(signature);
  return signature
}

// 定义一个异步函数来请求空投
async function requestAirdrop(publicKey, connection) {
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


const main = async () => {
  try {
    // 1. 配置连接到 Solana 测试网络
    const network = WalletAdapterNetwork.Testnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint, 'confirmed')
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    // console.log(connection)
    //console.log(blockhash)
    const keys = private_keys.map(e => e.value)

    // const senderSecretKey = base58.decode('')
    // const senderKeypair = Keypair.fromSecretKey(senderSecretKey)
    // const publicKey = new PublicKey();
    const arr = keys.map(element => {
      console.log(element);
      const key_pair = Keypair.fromSecretKey(base58.decode(element));
      // 1. getBalance
      // return connection.getBalance(key_pair.publicKey,'confirmed')
      return connection.getAccountInfo(key_pair.publicKey, 'confirmed')
      // return requestAirdrop(key_pair.publicKey, connection)
    });
    let res = await Promise.all(arr);
    res = res.map((e, index) => {
      return {
        key_pair: Keypair.fromSecretKey(base58.decode(keys[index])),
        ...e,
      }
    })
    res.sort((a, b) => a.lamports > b.lamports)
    // divid(res);
    // console.log(res);
    // const res = await transferSolana(senderKeypair, publicKey, 0.01)
    // console.log(res);
  } catch (e) {
    console.log(e)
    console.log('main paniced');
  }
}


await main()
// console.log();
// console.log(process.env);