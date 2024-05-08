import { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { private_keys } from './private_key.mjs'
import base58 from 'bs58'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

export async function getTestnetTokens(connection, key_pair) {
    // 创建一个新的钱包和连接到测试网
    // const connection = new Connection(Connection.clusterApiUrl('testnet'), 'confirmed');
    // const key_pair = Keypair.generate();

    console.log(`Generated new key_pair with public key: ${key_pair.publicKey.toBase58()}`);

    // 申请水龙头代币
    try {
        const airdropSignature = await connection.requestAirdrop(
            key_pair.publicKey,
            LAMPORTS_PER_SOL // 请求1 SOL的代币数量
        );
        await connection.confirmTransaction(airdropSignature);
        console.log('Airdrop successful!');
    } catch (error) {
        console.error('Airdrop failed', error);
    }
}
/* 
const keys = private_keys.map(e => Keypair.fromSecretKey(base58.decode(e.value)))

const network = WalletAdapterNetwork.Testnet
const endpoint = clusterApiUrl(network)
const connection = new Connection(endpoint, 'confirmed')
const { blockhash } = await connection.getLatestBlockhash('finalized')
console.log(connection)
console.log(blockhash)

// 运行函数
// await getTestnetTokens(connection, keys[0]);
await getTestnetTokens(connection, keys[3]);
 */