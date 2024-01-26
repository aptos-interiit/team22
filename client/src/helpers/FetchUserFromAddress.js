// Summary: Fetches user from address


// importing the aptos library
import { Network, Provider } from "aptos";

// addre: the address of the module
const addre = process.env.REACT_APP_MODULE_ADDRESS;

// provider: the provider of the blockchain
export const provider = new Provider(Network.TESTNET);

// FetchUserFromAddress: fetches the user data from the blockchain
export const FetchUserFromAddress = async (address) => {

    // resource: the resource of the module i.e. Address_to_artist
    const resource = await provider.getAccountResource(
      `${addre}`,
      `${addre}::music_platform::Address_to_artist`
    );
    const tableHandle = resource.data.content.handle;
    const tableItem = {
      key_type: "address",
      value_type: `${addre}::music_platform::User`,
      key: `${address}`,
    };
    try {
      const usery = await provider.getTableItem(tableHandle, tableItem);
      return usery;
    } catch (err) {
      console.log(err);
    }
}
