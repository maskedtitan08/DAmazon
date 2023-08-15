import { ethers } from "ethers";
import { useState, useEffect } from "react";
import DAmazon from "../artifacts/contracts/DAmazon.sol/DAmazon.json"

const Navigation = ({ account, setAccount, setContract, setProvider }) => {
    const [connected, setConnected] = useState(true);
    const loadWeb3 = async () => {
        let signer = null;
        if (window.ethereum == null) {
            console.log("No Metamask detected");
            const provider = ethers.getDefaultProvider();
            setProvider(provider);
        }
        else {
            const provider = new ethers.BrowserProvider(window.ethereum);
            console.log(provider);
            setProvider(provider);
            const chainId = 80001;
            const network = await provider.getNetwork();

            if (network.chainId == chainId) {
                window.ethereum.on("chainChanged", () => {
                    window.location.reload();
                });

                window.ethereum.on("accountsChanged", () => {
                    window.location.reload();
                });
                signer = await provider.getSigner();
                const account = await signer.getAddress();
                setAccount(account);
                setConnected(false);
                // console.log(account);
                const contractAddress = "0x8eeE2d0fc44C9BD63318D06fd385Fb8A5Db08865";
                const contract = new ethers.Contract(contractAddress, DAmazon.abi, signer);

                setContract(contract);
            }
            else {
                alert("Connect to Polygon Mumbai Testnet");
            }
            // console.log(contract);
        }
    };

    // console.log(account);

    return (
        <nav>
            <div className='nav__brand'>
                <h1>DAmazon</h1>
            </div>

            <input type="text" className='nav__search' placeholder="Search Items" />
            <button type="button" className='nav__connect' onClick={loadWeb3} disabled={!connected}>
                {connected ? "Connect" : account.length === 42 ? `${account.slice(0, 6)}...${account.slice(-3)}` : account}
                {/* {account.length === 42 ? `${account.slice(0, 6)}...${account.slice(-3)}` : account} */}
            </button>
            <ul className="nav__links">
                <li><a href="#Clothing & Jwelery">Clothing and Jwelery</a></li>
                <li><a href="#Electronics & Gadegts">Electronics and Gadgets</a></li>
                <li><a href="#Toys & Gaming">Toys & Gaming</a></li>
            </ul>

        </nav>
    );
}

export default Navigation