import { ethers, run } from 'hardhat';

/**
 * Deploys the JBX STaking Contracts.
 *
 * Example usage:
 *
 * npx hardhat run scripts/deploy.ts --network rinkeby
 *
 */
async function deploy(contractName: string, ...args: any[]) {
  const [signer] = await ethers.getSigners();
  const UriResolverFactory = await ethers.getContractFactory(contractName, signer);
  const contract = await UriResolverFactory.deploy();
  console.log(`${contractName} => ${contract.address}`);
  console.log(`waiting for 5 confirmations [0/5]`);
  await contract.deployTransaction.wait(1);
  console.log(`waiting for 5 confirmations [1/5]`);
  await contract.deployTransaction.wait(2);
  console.log(`waiting for 5 confirmations [2/5]`);
  await contract.deployTransaction.wait(3);
  console.log(`waiting for 5 confirmations [3/5]`);
  await contract.deployTransaction.wait(4);
  console.log(`waiting for 5 confirmations [4/5]`);
  await contract.deployTransaction.wait(5);
  console.log(`contract ${contractName} was deployed at address ${contract.address}`);
  console.log('verify contract');
  try {
    await run('verify:verify', {
      address: contract.address,
      constructorArguments: args,
    });
  } catch (error: any) {
    console.log(`contract verification failed`);
    console.log(`Error: ${error?.message}`);
  }

  return contract;
}

async function main() {
  const JBVeTokenUriResolver = await deploy('JBVeTokenUriResolver');
  console.log(`https://rinkeby.etherscan.io/address/${JBVeTokenUriResolver.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(`Error: ${e.message}`);
    process.exit(-1);
  });
