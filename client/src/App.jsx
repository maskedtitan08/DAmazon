import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import Navigation from "./components/Navigation";
import Section from "./components/Section"
import Product from "./components/Product"
import DAmazon from "./artifacts/contracts/DAmazon.sol/DAmazon.json"
import './App.css'

function App() {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  }

  useEffect(() => {
    if (account && contract) {
      loadBlockchainData(contract, account);
    }
  }, [account, contract]);
  const loadBlockchainData = async (contract, account) => {
    console.log(account);
    console.log(contract);

    const items = []
    for (var i = 0; i < 9; i++) {
      const product = await contract.products(i + 1);
      items.push(product);
    }
    console.log(items);
    // using filter function to separate items based on their category
    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')
    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  }

  return (
    <>
      <div>
        <Navigation account={account} setAccount={setAccount} setContract={setContract} setProvider={setProvider} />
        <h2>DAmazon Best Sellers</h2>
        {electronics && clothing && toys && (
          <>
            <Section title={"Clothing & Jewelery"} items={clothing} togglePop={togglePop} />
            <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
            <Section title={"toys & Gaming"} items={toys} togglePop={togglePop} />
          </>
        )}

        {toggle && (
          <Product item={item} provider={provider} account={account} contract={contract} togglePop={togglePop} />
        )}
      </div>
    </>
  )
}

export default App
