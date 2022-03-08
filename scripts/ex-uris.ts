import { ethers } from 'hardhat';
import { BigNumber, Contract } from 'ethers';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import 'colors';
import TokenUriResolver from '../artifacts/contracts/JBVeTokenUriResolver.sol/JBVeTokenUriResolver.json';

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = new Contract('0x9B716015ADa36d86b0bFba65233744CC908BdAe0', TokenUriResolver.abi, signer);
  const csvFile = (await fs.readFile(resolve(__dirname, './data/distribution.csv'))).toString();
  const lines = csvFile
    .split('\n')
    .slice(1)
    .map((line) => {
      const words = line.split(',');
      (words as any)[2] = words[2].split('-'); /* get the second range */
      return words;
    }) as any[];
  for (const [, , [start, next]] of lines) {
    const durations = [864000, 2160000, 8640000, 21600000, 86400000];
    for (const duration of durations) {
      const uri = await contract.tokenURI(Number(start), Number(duration), {
        gasLimit: BigNumber.from('210000'),
      });
      if (typeof uri === 'string') {
        console.log(`Amount [${start} - ${Number(next) - 1}]`.green.padEnd(40, ' '), `Duration [${duration}]`.blue.padEnd(22, ' '), '\t', uri.yellow);
      } else {
        console.log(uri);
        throw Error('Invalid Response');
      }
    }
  }
}

main();