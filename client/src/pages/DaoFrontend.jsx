import React, { useContext, useEffect, useState, useRef } from "react";
import { dataContext } from "../Context/dataContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";



export const moduleAddress = process.env.REACT_APP_MODULE_ADDRESS;
const nftMintAddr = process.env.REACT_APP_RESOURCE_ACCOUNT;
const dao_addr = process.env.REACT_APP_DAO_ADDRESS

function DaoFrontend() {
  const { account, provider } = useContext(dataContext);
  const [accountHasList, setAccountHasList] = useState(false);
  const [currentProposals, setCurrentProposals] = useState([]);
  const [load, setLoad] = useState(1)
  const [showOne, setShowOne] = useState("hidden")
  const [showTwo, setShowTwo] = useState("hidden")
  const [pending, setPending] = useState([]);
  const [passed, setPassed] = useState([])
  const [failed, setFailed] = useState([])
  const { signAndSubmitTransaction } = useWallet();

  const bottomRef = useRef(null);

  const [proposalAttributes, setProposalAttributes] = useState({
    title: "",
    description: "",
    startTime: 0,
    proposalId: 0,
    songId: 0,
    artist: "0x0",
  })

  const [voteAttributes, setVoteAttributes] = useState({
    tokenName: "",
    proposalId: 0,
    decision: false,
    propertyVersion: 0,
  })

  useEffect(() => {
    (async () => {
      setLoad(1)
      if (!account) return;

      const resource = await provider.getAccountResource(
        `${dao_addr}`,
        `${moduleAddress}::nft_dao::Proposals`
      );
      const resource2 = await provider.getAccountResource(
        `${dao_addr}`,
        `${moduleAddress}::nft_dao::DAO`
      );
      console.log(resource.data.proposals);
      // console.log(resource2.data);
      const tableHandle = resource.data.proposals.handle;
      let prop = [];
      let pending = [], passed = [], failed = [];

      // // console.log(/tableHandle);

      for (let i = 1; i <= resource2.data.next_proposal_id; i++) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::nft_dao::Proposal`,
          key: `${i}`,
        };
        try {
          const proposal = await provider.getTableItem(tableHandle, tableItem);
          prop.push(proposal);
          if (proposal.resolution === 0) {
            pending.push({ proposal: proposal, id: i });
          }
          else if (proposal.resolution === 1 || proposal.resolution === 3) {
            passed.push({ proposal: proposal, id: i });
          }
          else if (proposal.resolution === 2 || proposal.resolution === 4) {
            failed.push({ proposal: proposal, id: i });
          }
          console.log(proposal);
        } catch (err) {
          console.log(err);
        }
      }
      setPending(pending)
      setPassed(passed)
      setFailed(failed)
      setCurrentProposals(prop);
      setLoad(0);
    })();
  }, [account]);


  const getNFT = async (e) => {
    e.preventDefault();
    // console.log("getNFT");
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${nftMintAddr}::simple_defi::mint_event_ticket`,
        typeArguments: [],
        functionArguments: [],
      },
    };
    // console.log(payload)
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error) {
      console.log(error);
      setAccountHasList(false);
    }
  }

  const handleChange1 = (event) => {
    setProposalAttributes({
      ...proposalAttributes,
      [event.target.name]: event.target.value,
    });
  };

  const handleChange2 = (event) => {
    setVoteAttributes({
      ...voteAttributes,
      [event.target.name]: event.target.value,
    });
  };

  const createProposal = async (e) => {
    // console.log(proposalAttributes.title+" "+proposalAttributes.description+" "+proposalAttributes.startTime+" "+proposalAttributes.proposalId+" "+proposalAttributes.songId+" "+proposalAttributes.artist)
    e.preventDefault();
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${moduleAddress}::nft_dao::create_proposal2`,
        typeArguments: [],
        functionArguments: [
          `${dao_addr}`,
          proposalAttributes.title,
          proposalAttributes.description,
          parseInt((parseInt(proposalAttributes.startTime)) * 60 + parseInt(Date.now() / 1000)),
          proposalAttributes.proposalId,
          proposalAttributes.songId,
          `${proposalAttributes.artist}`
        ],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      // console.log("done");
      setAccountHasList(true);
    } catch (error) {
      setAccountHasList(false);
    }
  }

  const vote = async (e) => {
    e.preventDefault();
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${moduleAddress}::nft_dao::vote2`,
        typeArguments: [],
        functionArguments: [
          `${dao_addr}`,
          voteAttributes.proposalId,
          voteAttributes.decision,
          [voteAttributes.tokenName],
          [voteAttributes.propertyVersion]
        ],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error) {
      setAccountHasList(false);
    }
  }
  const resolve = async (id) => {
    console.log(id);
    if (!account) return [];
    // build a transaction payload to be submited
    const payload = {
      sender: `${account.address}`,
      data: {
        function: `${moduleAddress}::nft_dao::resolve2`,
        typeArguments: [],
        functionArguments: [
          id,
          `${dao_addr}`,
        ],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // console.log(response);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error) {
      setAccountHasList(false);
    }
  }

  const handleOne = () => {
    if (showOne === "hidden") {
      setShowOne("block")
    }
    else {
      setShowOne("hidden")
    }

  }
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [showOne, showTwo]);

  function convertSecondsToDateString(second) {
    const date = new Date(second * 1000); // Convert seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 as month starts from 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}  ${hours}:${minutes}`;
    return formattedDate;
  }

  return (
    load ? (<div className="loader"></div>) : (
      <>
        <div className=" text-white flex flex-col" >
          <p className="ml-auto mr-auto mt-10 text-8xl">
            WELCOME TO DAO
          </p>
          <button className='rounded-md bg-green-600 text-white px-3 py-2 ml-auto mr-auto mt-10' onClick={(e) => getNFT(e)}>Get membersip NFT</button>
          {
            pending.length ? (<>
              <p className="text-2xl ml-auto mr-auto mt-10">Active Proposals</p>
              <div className="flex p-10 justify-center content-center gap-5">
                {
                  pending.map((p, id) => (
                    <div key={id} className="bg-gray-900 border-1 rounded-lg overflow-hidden shadow-md text-white">
                      <div className="p-6">
                        <h1 className="text-xl font-semibold mb-2">Title:{p.proposal.name}</h1>
                        <p className="text-white-700 mb-4">Description :{p.proposal.description}</p>
                        <p className="text-white-700">Start Time: {convertSecondsToDateString(p.proposal.start_time_sec)}</p>
                        <p className="text-white-700">{p.proposal.proposal_id != 0 ? "Offchain" : "Onchain"}</p>
                        <p className="text-white-700">{p.proposal.resolution === 1 ? "Resolved" : "Not Resolved"}</p>
                        <button
                          className="rounded-md bg-indigo-600 text-white px-3 py-2 mt-4"
                          onClick={() => resolve(p.id)}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </>) : (<></>)
          }
          {
            passed.length ? (<>
              <p className="text-2xl ml-auto mr-auto">Passed Proposals</p>
              <div className="flex p-10 justify-center content-center gap-5">
                {
                  passed.map((p, id) => (
                    <div key={id} className="bg-gray-900 border-1 rounded-lg overflow-hidden shadow-md text-white">
                      <div className="p-6">
                        <h1 className="text-xl font-semibold mb-2">Title:{p.proposal.name}</h1>
                        <p className="text-white-700 mb-4">Description :{p.proposal.description}</p>
                        <p className="text-white-700">Start Time: {convertSecondsToDateString(p.proposal.start_time_sec)}</p>
                        <p className="text-white-700">{p.proposal.proposal_id != 0 ? "Offchain" : "Onchain"}</p>
                        <p className="text-white-700">Resolved</p>
                        <p className="text-white-700">YES Votes: {p.proposal.final_yes_votes}</p>
                        <p className="text-white-700">NO Votes: {p.proposal.final_no_votes}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </>) : (<></>)
          }

          {
            failed.length ? (<>
              <p className="text-2xl ml-auto mr-auto">Failed Proposals</p>
              <div className="flex p-10 justify-center content-center gap-5">
                {
                  failed.map((p, id) => (
                    <div key={id} className="bg-gray-900 border-1 rounded-lg overflow-hidden shadow-md text-white">
                      <div className="p-6">
                        <h1 className="text-xl font-semibold mb-2">Title:{p.name}</h1>
                        <p className="text-white-700 mb-4">Description :{p.description}</p>
                        <p className="text-white-700">Start Time: {convertSecondsToDateString(p.start_time_sec)}</p>
                        <p className="text-white-700">{p.proposal_id != 0 ? "Offchain" : "Onchain"}</p>
                        <p className="text-white-700">Not Passed</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </>) : (<></>)
          }

          <div className="flex mb-10">
            <button className='rounded-md bg-indigo-600 text-white px-3 py-2 ml-auto mr-auto mt-10' onClick={handleOne}>Create Proposal</button>
            <button className='rounded-md bg-indigo-600 text-white px-3 py-2 ml-auto mr-auto mt-10' onClick={() => showTwo === "hidden" ? setShowTwo("block") : setShowTwo("hidden")}>Vote On Proposal</button>
          </div>
        </div>

        <hr className={`${showOne} mt-10`} />

        <div className={`${showOne} mt-10 flex flex-col justify-center align-center`}>
          <p className="text-4xl text-white ml-auto mr-auto mb-10"> Create Proposal Here</p>
          <div className="sm:col-span-3 text-white flex flex-col sm:flex-row ml-auto mr-auto">
            <h1 className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md mb-2 sm:mb-0 mr-2">
              For OffChain Suggestion put Proposal Type : 0
            </h1>
            <h1 className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md mb-2 sm:mb-0 mr-2">
              To Remove Song put Proposal Type : 1
            </h1>
            <h1 className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md mb-2 sm:mb-0">
              To Remove artist put Proposal Type : 2
            </h1>
          </div>


          <form className='ml-10 mt-10 mr-10' onSubmit={createProposal}>
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="off"
                      onChange={handleChange1}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                    Description
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="description"
                      id="description"
                      autoComplete="off"
                      onChange={handleChange1}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                    Proposal Type
                  </label>
                  <div className="mt-2">
                    <input
                      type="Number"
                      name="proposalId"
                      id="proposalId"
                      autoComplete="off"
                      onChange={handleChange1}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                    Start Time (In Minutes)
                  </label>
                  <div className="mt-2">
                    <input
                      id="startTime"
                      name="startTime"
                      type="Number"
                      autoComplete="off"
                      onChange={handleChange1}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                {proposalAttributes.proposalId == 2 ? (
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                      Artist Address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="artist"
                        id="artist"
                        autoComplete="off"
                        onChange={handleChange1}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                ) : ""}

                {proposalAttributes.proposalId == 1 ? (
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                      SongId
                    </label>
                    <div className="mt-2">
                      <input
                        type="Number"
                        name="songId"
                        id="songId"
                        autoComplete="off"
                        onChange={handleChange1}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                ) : ""}
                <button className='rounded-md bg-indigo-600 text-white px-3 py-2  mt-10' type="submit" >Create Proposal</button>
              </div>
            </div>

          </form>
        </div>

        <hr className={`${showTwo} mt-10`} />

        <div className={`${showTwo} flex flex-col text-white mt-10`}>
          <p className="text-4xl ml-auto mr-auto">Vote On Proposal</p>
          <form className='ml-10 mt-10 mr-10' onSubmit={vote}>
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                    Token Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="tokenName"
                      id="tokenName"
                      autoComplete="off"
                      onChange={handleChange2}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white mt-3">
                    Proposal Id
                  </label>
                  <div className="mt-2">
                    <input
                      type="Number"
                      name="proposalId"
                      id="proposalId"
                      autoComplete="off"
                      onChange={handleChange2}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                    Property version
                  </label>
                  <div className="mt-2">
                    <input
                      type="Number"
                      name="propertyVersion"
                      id="propertyVersion"
                      autoComplete="off"
                      onChange={handleChange2}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white mt-3">
                      Decision
                    </label>
                    <div className="mt-2">
                      <input
                        type="Boolean"
                        name="decision"
                        id="decision"
                        autoComplete="off"
                        onChange={handleChange2}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                  </div>
                </div>
                <button className='rounded-md bg-indigo-600 text-white px-3 py-2  mt-10' type="submit">Vote</button>
              </div>
            </div>

          </form>
        </div>
        <div ref={bottomRef} ></div>

      </>)
  )
}

export default DaoFrontend;