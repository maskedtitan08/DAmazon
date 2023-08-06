const hre = require("hardhat");
const { items } = require("../client/src/items.json");

// const tokens = (n) => {
//   return ethers.utils.parseEther(n.toString(), 'ether')
// }

async function main() {

  const dAmazon = await hre.ethers.deployContract("DAmazon");

  await dAmazon.waitForDeployment();

  console.log("DAmazon contract deployed to: ", dAmazon.target);

  const [deployer] = await ethers.getSigners();   // using [] and plural signers if you want multiple accounts
  // const deployer = await ethers.getSigner();         // not using [] ans using singular signer as I want only one account

  // Listing items...
  for (let i = 0; i < items.length; i++) {
    const transaction = await dAmazon.connect(deployer).listProducts(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      ethers.parseEther(items[i].price.toString(),'ether'),    // parsing ethers to convert ethers into wei whcih can be stored in contract
      items[i].rating,
      items[i].stock,
    )

    await transaction.wait()

    console.log(`Listed item ${items[i].id}: ${items[i].name}`)
  }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
