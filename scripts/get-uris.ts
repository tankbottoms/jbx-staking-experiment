import { ethers } from 'hardhat';
import { BigNumber, Contract } from 'ethers';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import 'colors';
import art from '../artifacts/contracts/JBVeTokenUriResolver.sol/JBVeTokenUriResolver.json';

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = new Contract('0x3E7558A217D0bE9BBD32E5F8a1aa65e0E3138C54', art.abi, signer);

  const csvFile = (await fs.readFile(resolve(__dirname, './data/distribution.csv'))).toString();
  const lines = csvFile
    .split('\n')
    .slice(1)
    .map((line) => {
      const words = line.split(',');
      (words as any)[2] = words[2].split('-');
      return words;
    }) as any[];
  for (const [, , [start, next]] of lines) {
    const durations = [864000, 2160000, 8640000, 21600000, 86400000];
    for (const duration of durations) {
      const uri = await contract.tokenURI(Number(start), Number(duration), {
        gasLimit: BigNumber.from('210000'),
      });
      if (typeof uri === 'string') {
        console.log(`AMOUNT[${start} - ${Number(next) - 1}]`.green.padEnd(40, ' '), `DURATION[${duration}]`.blue.padEnd(22, ' '), '\t', uri.yellow);
      } else {
        console.log(uri);
        throw Error('INVALID Response');
      }
    }
  }
}

main();
