/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */

const {
    Aptos,
    AptosConfig,
    Network,
    U64,
    Ed25519PrivateKey
  } = require("@aptos-labs/ts-sdk");
  
  const APTOS_NETWORK = Network.TESTNET;
  
  /**
   * Prints the balance of an account
   * @param aptos
   * @param name
   * @param address
   * @returns {Promise<*>}
   *
   */

  const dao_address = "0x4d0cdca6642a0ef9c3831a575777695c965cfc2e5f38bec722ecbb3013ac4875"

  
  const test = async () => {
  
    // 
    const config = new AptosConfig({ network: APTOS_NETWORK });
    const sdk = new Aptos(config);
    const privateKeyString = "0x4e7ca8aabbc852d6e733c3ccb6d6adfce8518fa85c7bc8a2cda4f0ffc3375f58";
    const privateKey = new Ed25519PrivateKey(privateKeyString);
    const account = await sdk.deriveAccountFromPrivateKey({ privateKey: privateKey });
    
    // console.log(`account address is: ${account.accountAddress}`);
    // console.log(`private address is: ${account.privateKey}`);
    // console.log(`public address is: ${account.publicKey}`);
  
    let txn = await sdk.build.transaction({
      sender: account.accountAddress,
      data: {
        function: "0x840cb3775c1fc264d12859029eeeff6b5f77eebf510f1c42503d52ca06a18f31::nft_dao::create_proposal",
        type_arguments: [],
        arguments: [`${dao_address}`, "fds", "edsd", ["no_op"], [[]], [[[]]], [[]], 1, ["T22 NFT Pass"], [800920889]],
      },
    });
  
    console.log("\n=== Transfer transaction ===\n");
    let committedTxn = await sdk.signAndSubmitTransaction({ signer: account, transaction: txn });
    console.log(`Committed transaction: ${committedTxn.hash}`);
    await sdk.waitForTransaction({ transactionHash: committedTxn.hash });
    
  };
  
  module.exports = {
    test
  }
  