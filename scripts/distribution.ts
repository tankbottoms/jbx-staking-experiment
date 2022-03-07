import { promises as fs } from 'fs';
import { resolve } from 'path';

function getRandomInt(max: number) {
  let result = Math.floor(Math.random() * max);
  if (result !== 0) return result;
  return 1;
};

const ranges = Array(60).fill(0);

for (let i = 0; i < 60; i++) {  
  // ranges[i] = getRandomInt(60);
  getRandomInt(60)
};

console.log(ranges);

for (let i = 0; i < 60; i++) {  
  let a = ranges[i] - 4;
  let b = a * 5;
  console.log(`${ranges[i]}`)  
  ranges[i] = b;
};

console.log(ranges);



async function main() {
  const csvFile = (await fs.readFile(resolve(__dirname, './data/jbx-holders.csv'))).toString();
  //Wallet address,Total JBX balance,Staked balance,Unstaked balance,Total ETH paid,Last paid timestamp
  console.log(ranges);
  const [headings, ...lines] = csvFile
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => line.split(',').map((l) => l.trim()));
  const balances = lines.map((line) => line[1]).filter((line) => line !== '0');
  const buckets = Array(ranges.length).fill(0);
  let outLines: string[] = [];
  for (let i = 0; i < balances.length; i++) {
    const b = Number(balances[i]);
    let bucket = ranges.findIndex((range) => b < range);
    if (bucket >= -1) {
      bucket == -1 && console.log({ bucket, i, b });
      buckets[bucket]++;
    } else {
      buckets[ranges.length] = typeof buckets[ranges.length] === 'undefined' ? 1 : buckets[ranges.length] + 1;
    }
  }
  for (let i = 0; i < buckets.length; i++) {
    outLines.push(`${i + 1},${ranges[i] - (ranges[i - 1] || 1)},${ranges[i - 1] || 0}-${ranges[i]},${buckets[i]}`);
  }
  outLines.unshift('buckets,difference,ranges,holders');
  await fs.writeFile(resolve(__dirname, './data/distribution.csv'), outLines.join('\n'));
  console.log(buckets);
};

false && main();
