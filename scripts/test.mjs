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

const transferSolana = async (senderKeypair, receiverPublicKey, amount, connection) => {
  // 创建交易指令
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: receiverPublicKey,
      lamports: amount, // 将 SOL 转换为 lamports
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

// Equal distribution of all balances in the accounts
const divid = async (accounts, connection) => {
  const totalBalance = accounts.map(e => e.lamports).reduce((acc, balance) => acc + balance, 0);
  console.log(Math.floor(totalBalance/LAMPORTS_PER_SOL) );
  // const totalBalance = res.reduce((acc, balance) => acc.lamports + balance, 0);
  let head = 0, tail = accounts.length - 1, divid_number = Math.floor((totalBalance / accounts.length));
  while (head < tail) {
    const head_num = await connection.getBalance(accounts[head].key_pair.publicKey, 'confirmed')
    const tail_num = await connection.getBalance(accounts[tail].key_pair.publicKey, 'confirmed')
    let toReduce = head_num - divid_number;
    let toAdd = divid_number - tail_num;
    if (toReduce < toAdd) {
      
      await transferSolana(accounts[head].key_pair, accounts[tail].key_pair.publicKey, toReduce, connection)
      head++;
    } else if (toReduce > toAdd) {
      
      await transferSolana(accounts[head].key_pair, accounts[tail].key_pair.publicKey, toAdd, connection)
      tail--
    } else {
      
      await transferSolana(accounts[head].key_pair, accounts[tail].key_pair.publicKey, toAdd, connection)
      head++;
      tail--;
    }
  }
  // console.log(totalBalance);
  // console.log(accounts);
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
    res.sort((a, b) => b.lamports - a.lamports)
    await divid(res, connection);
    // transferSolana(res[0].key_pair, res[2].key_pair.publicKey, 0.1 * LAMPORTS_PER_SOL, connection)
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