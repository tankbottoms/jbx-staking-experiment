import { BigNumber, utils } from 'ethers';
import { ethers } from 'hardhat';
import art from '../artifacts/contracts/JBVeTokenUriResolver.sol/JBVeTokenUriResolver.json';

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract('0xca8CB74A98ec060C40a99a16E833F314Eb206541', art.abi, signer);
  console.log(contract);
  console.log(
    await contract.functions.tokenURI(BigNumber.from(1000), BigNumber.from(864000), {
      gasLimit: BigNumber.from('210000'),
    }),
  );
}

main();
