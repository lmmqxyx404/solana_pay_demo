
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, clusterApiUrl } from '@solana/web3.js'

const network = WalletAdapterNetwork.Testnet
const endpoint = clusterApiUrl(network)
const connection = new Connection(endpoint)
console.log(connection)
try {
  const { blockhash } = await connection.getLatestBlockhash('finalized')
  console.log(blockhash)
} catch (e) {
  console.log(e)
}
