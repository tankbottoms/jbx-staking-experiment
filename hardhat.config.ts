import dotenv from 'dotenv';
// import taskNames from 'hardhat/builtin-tasks/task-names';

import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';

dotenv.config();

const chainIds = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  polygon: 137,
  ganache: 1337,
  hardhat: 31337,
  mumbai: 80001,
};

const defaultNetwork = 'localhost';

const infuraId = process.env.INFURA_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VERBOSE = false;

task('accounts', 'Prints the list of available ETH accounts:', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(await account.address);
  }
});

task('networks', 'Prints the configured ETH network settings:', async (args, hre) => {
  if (VERBOSE) {
    console.log(`Available Networks:`);
    console.log(hre['config']['networks']);
  } else {
    Object.keys(chainIds).forEach((k) => {
      console.log(`Network ${k}`);
      console.log(hre['config']['networks'][`${k}`]);
    });
  }
});

export default {
  defaultNetwork,
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      blockGasLimit: 0x1fffffffffffff,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + infuraId,
      gasPrice: 50000000000,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/' + infuraId,
      gasPrice: 50000000000,
      accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeCollector: {
      default: 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: 'none',
          },
          // You should disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      { version: '0.6.0' },
    ],
  },
  mocha: {
    bail: true,
    timeout: 6000,
  },
  gasReporter: {
    currency: 'USD',
    enabled: !!process.env.REPORT_GAS,
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts',
    cache: './cache',
    tests: './test',
  },
};

// // List details of deployer account.
// task('account', 'Get balance informations for the deployment account.', async (_, { ethers }) => {
//   // const hdkey = require('ethereumjs-wallet/hdkey');
//   // const bip39 = require('bip39');
//   // let mnemonic = fs.readFileSync('./mnemonic.txt').toString().trim();
//   // const seed = await bip39.mnemonicToSeed(mnemonic);
//   // const hdwallet = hdkey.fromMasterSeed(seed);
//   // const wallet_hdpath = "m/44'/60'/0'/0/";
//   // const account_index = 0;
//   // let fullPath = wallet_hdpath + account_index;
//   // const wallet = hdwallet.derivePath(fullPath).getWallet();
//   // var EthUtil = require('ethereumjs-util');
//   // const address = '0x' + EthUtil.privateToAddress(wallet._privKey).toString('hex');
//   // console.log('Deployer Account: ' + address);
//   // for (let n in config.networks) {
//   //   try {
//   //     let provider = new ethers.providers.JsonRpcProvider(config.networks[n].url);
//   //     let balance = await provider.getBalance(address);
//   //     console.log(' -- ' + n + ' --  -- -- 📡 ');
//   //     console.log('   balance: ' + ethers.utils.formatEther(balance));
//   //     console.log('   nonce: ' + (await provider.getTransactionCount(address)));
//   //   } catch (e) {
//   //     console.log(e);
//   //   }
//   // }
// });

// task('compile:one', 'Compiles a single contract in isolation')
//   .addPositionalParam('contractName')
//   .setAction(async function (args, env) {
//     const sourceName = env.artifacts.readArtifactSync(args.contractName).sourceName;

//     const dependencyGraph = await env.run(taskNames.TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH, {
//       sourceNames: [sourceName],
//     });

//     const resolvedFiles = dependencyGraph.getResolvedFiles().filter((resolvedFile) => {
//       return resolvedFile.sourceName === sourceName;
//     });

//     const compilationJob = await env.run(
//       taskNames.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
//       {
//         dependencyGraph,
//         file: resolvedFiles[0],
//       },
//     );

//     await env.run(taskNames.TASK_COMPILE_SOLIDITY_COMPILE_JOB, {
//       compilationJob,
//       compilationJobs: [compilationJob],
//       compilationJobIndex: 0,
//       emitsArtifacts: true,
//       quiet: true,
//     });
//   });
