// import logo from './logo.svg';
import "./App.css";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { useEffect, useState } from "react";
import axios from "axios";
import * as cadenceScripts from "./cadence/scripts";

fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "0xProfile": "0xc8c340cebd11f690", // the address where the DC smart contracts are deployed
});

function App() {
  const [user, setUser] = useState({});
  const [nftIdsInWallet, setNftIdsInWallet] = useState([]);

  // subscribing to fcl.currentUser will set the user state after a succesful login or logout
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  // first fetch the list of IDs for the DC NFTs owned by the wallet-user
  const getIDsOfWalletDcNFTs = async () => {
    try {
      const result = await fcl.query({
        cadence: cadenceScripts.getIDsofWalletsDcNFTs,
        args: (arg, t) => [arg(user.addr, t.Address)],
      });

      console.log(result);
      setNftIdsInWallet(result);
    } catch (e) {
      console.error(e);
    }
  };

  // get all the DC NFTs info owned by the wallet-user
  // plural
  const getNFTsById = async () => {
    let nftsInWallet = [];
    for (let id of nftIdsInWallet) {
      nftsInWallet.push(await getNFTbyID(id));
    }
    console.log(nftsInWallet);
  };

  // fetch a single DC NFT info by ID owned by the wallet-user
  // singular
  const getNFTbyID = async (id) => {
    try {
      const result = await fcl.query({
        cadence: cadenceScripts.getDcNFTbyID,
        args: (arg, t) => [arg(user.addr, t.Address), arg(id, t.UInt64)],
      });

      // console.log(result);
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  // get all the created NFT templates from the collection
  const getAllDcNftTemplates = async () => {
    try {
      const result = await fcl.query({
        cadence: cadenceScripts.getAllItemTemplates,
      });

      console.log(result);
    } catch (e) {
      console.error(e);
    }
  };

  // fetch the lands left in packs (stored in DC wallet)
  /*   const getDCaccountAssets = async () => {
    try {
      const response = await axios.get(
        "https://bay-api.blocto.app/bloctoBay/account/0xc8c340cebd11f690/nfts?limit=5850&offset=0"
      );

      console.log("response GOT");

      let nfts = response.data.nfts;

      let lands = nfts.filter((item) => {
        if (item.name.includes("test")) return item;
      });

      console.log(lands.length);
    } catch (e) {
      console.error(e.response);
    }
  }; */

  return (
    <div className="App">
      <h1>User's Address: {user?.addr}</h1>

      {/* fcl.authenticate will automatically give you all the availalble options for the user to login */}
      {/* user.loggedIn to show/hide UI elements depending on user login status  */}
      {!user.loggedIn && (
        <button onClick={() => fcl.authenticate()}>Connect Wallet</button>
      )}
      {/* user log out */}
      {/* user.loggedIn to show/hide UI elements depending on user login status  */}
      {user.loggedIn && (
        <button onClick={() => fcl.unauthenticate()}>Disconnect Wallet</button>
      )}

      <span>
        1. first get a list of IDs for the DC NFTs owned by the wallet
      </span>
      <button onClick={() => getIDsOfWalletDcNFTs()}>
        Get IDs of wallet's DC NFTs
      </button>

      <span>2. Then fetch, by ID, all the DC NFTs owned by the wallet</span>
      <button onClick={() => getNFTsById()}>Get wallet's NFTs by ID</button>

      <span>3. Then fetch DC collection's Item Templates (metadata)</span>
      <button onClick={() => getAllDcNftTemplates()}>
        Get all DC templates
      </button>
    </div>
  );
}

export default App;
