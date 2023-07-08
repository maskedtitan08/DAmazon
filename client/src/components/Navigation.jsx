import { ethers } from "ethers";
import { useState, useEffect } from "react";
import DAmazon from "../artifacts/contracts/DAmazon.sol/DAmazon.json"

const Navigation = ({ account, setAccount, setContract,setProvider }) => {
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
            window.ethereum.on("chainChanged", () => {           // when chain changed window reload
                window.location.reload();
            });                                                     // these scripts are provided by metamask taaki hm jb bhi account change krein to automatically site pr refresh ho jaaye

            window.ethereum.on("accountsChanged", () => {        // when account change window relaod
                window.location.reload();
            });
            signer = await provider.getSigner();
            const account = await signer.getAddress();
            setAccount(account);
            setConnected(false);
            // console.log(account);
            const contractAddress = "0xC51C23b2742Dc44aE4eabD67739fb44F843142B3";
            const contract = new ethers.Contract(contractAddress, DAmazon.abi, signer);
            
            setContract(contract);
            // console.log(contract);
        }
    };

    // console.log(account);

    return (
        <nav>
            <div className='nav_brand'>
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