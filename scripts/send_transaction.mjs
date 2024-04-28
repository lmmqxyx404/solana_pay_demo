import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction
} from '@solana/web3.js';

// Immediately-invoked async function
(async () => {
  // Establish a connection to the Solana testnet
  const connection = new Connection(
    clusterApiUrl("testnet"),
    'confirmed'
  );

  // Generate a new random keypair for the sender
  const from = Keypair.generate();

  // Request an airdrop to the sender's public key (1 SOL)
  console.log('Requesting Airdrop...');
  const airdropSignature = await connection.requestAirdrop(
    from.publicKey,
    LAMPORTS_PER_SOL
  );

  // Confirm the transaction to ensure the airdrop was received
  await connection.confirmTransaction(airdropSignature, 'confirmed');
  console.log('Airdrop received');

  // Generate a new random keypair for the receiver
  const to = new PublicKey(
    'GWqjdGEk827i58jwFERrPHG1ECsttDb6S8jPs9eUBQnx'
  );

  // Create a new transaction
  const transaction = new Transaction();

  // Add a transfer instruction to the transaction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: LAMPORTS_PER_SOL / 100  // Transfer 0.01 SOL
    })
  );

  // Send the transaction and wait for confirmation
  console.log('Sending transaction...');
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  console.log(`Transaction successful with signature: ${signature}`);
})();
