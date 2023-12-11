import { Network, Provider } from "aptos";
import { useContext } from "react";
import { dataContext } from "../Context/dataContext";

const addre = process.env.REACT_APP_MODULE_ADDRESS;
const res_acc = process.env.REACT_APP_RESOURCE_ACCOUNT;
export const provider = new Provider(Network.TESTNET);

export const FetchUser = async (account) => {

    const resource = await provider.getAccountResource(
      `${addre}`,
      `${addre}::music_platform::Address_to_artist`
    );
    // console.log(resource);
    const tableHandle = resource.data.content.handle;

    const tableItem = {
      key_type: "address",
      value_type: `${addre}::music_platform::User`,
      key: `${account.address}`,
    };
    try {
      const usery = await provider.getTableItem(tableHandle, tableItem);
      return usery;
    } catch (err) {
      console.log(err);
    }
}
