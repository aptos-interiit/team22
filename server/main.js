/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */
require('dotenv').config()

const {
  Aptos,
  AptosConfig,
  Network,
  U64,
  Ed25519PrivateKey
} = require("@aptos-labs/ts-sdk");

const APTOS_NETWORK = Network.DEVNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;

/**
 * Prints the balance of an account
 * @param aptos
 * @param name
 * @param address
 * @returns {Promise<*>}
 *
 */

const user_to_artist = async (userAddress, artistAddresses, dist, amount) => {
  
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const sdk = new Aptos(config);
  const privateKeyString = PRIVATE_KEY;
  const privateKey = new Ed25519PrivateKey(privateKeyString);
  const account = await sdk.deriveAccountFromPrivateKey({ privateKey: privateKey });
  
  console.log(typeof(userAddress))
  
  let addresses = []
  let distx = []
  for(let i=0;i<artistAddresses.length;i++){
    addresses.push(`${artistAddresses[i]}`)
    distx.push(parseInt(dist[i]))
  }
  console.log(addresses)
  console.log(amount)
  console.log(distx)
  let txn = await sdk.build.transaction({
    sender: account.accountAddress,
    data: {
      function: `${MODULE_ADDRESS}::music_platform::user_to_artist`,
      typeArguments: [],
      functionArguments: [userAddress, addresses, distx, new U64(amount)],
    },
  });

  console.log("\n=== Transfer transaction ===\n");
  let committedTxn = await sdk.signAndSubmitTransaction({ signer: account, transaction: txn });
  console.log(`Committed transaction: ${committedTxn.hash}`);
  await sdk.waitForTransaction({ transactionHash: committedTxn.hash });
  return committedTxn.hash;
  
};

const update_timelistened = async (songId, time) => {
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const sdk = new Aptos(config);
  const privateKeyString = PRIVATE_KEY;
  const privateKey = new Ed25519PrivateKey(privateKeyString);
  const account = await sdk.deriveAccountFromPrivateKey({ privateKey: privateKey });

  let txn = await sdk.build.transaction({
    sender: account.accountAddress,
    data: {
      function: `${MODULE_ADDRESS}::music_platform::update_timelistened`,
      typeArguments: [],
      functionArguments: [`${songId}`, `${time}`],
    },
  });

  console.log("\n=== Transfer transaction ===\n");
  let committedTxn = await sdk.signAndSubmitTransaction({ signer: account, transaction: txn });
  console.log(`Committed transaction: ${committedTxn.hash}`);
  await sdk.waitForTransaction({ transactionHash: committedTxn.hash });
  return committedTxn.hash;
};

module.exports = {
  user_to_artist, update_timelistened
}
