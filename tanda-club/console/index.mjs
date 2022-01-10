import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';
const stdlib = loadStdlib(process.env);

(async () => {

  const isAlice = await ask(
    `Are you Alice?`,
    yesno
  );
  const who = isAlice ? 'Alice' : 'Bob';

  console.log(`Starting Tanda! as ${who}`);

  let acc = null;
  const createAcc = await ask(
    `Would you like to create an account? (only possible on devnet)`,
    yesno
  );

  if (createAcc) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  
  } else {
    const secret = await ask(
      `What is your account secret?`,
      (x => x)
    );
    acc = await stdlib.newAccountFromSecret(secret);
  }

  let ctc = null;
  if (isAlice) {
    ctc = acc.contract(backend);
    ctc.getInfo().then((info) => {
      console.log(`The contract is deployed as = ${JSON.stringify(info)}`); });
  } else {
    const info = await ask(
      `Please paste the contract information:`,
      JSON.parse
    );
    ctc = acc.contract(backend, info);
  }

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async () => fmt(await stdlib.balanceOf(acc));

  
  const before = await getBalance();
  console.log(`Your balance is ${before}`);

  const interact = { ...stdlib.hasRandom };

  interact.informTimeout = () => {
   console.log(`There was a timeout.`);
   process.exit(1);
  };

  if (isAlice) {
    const amt = await ask(
      `How much do you want to Contribute?`,
      stdlib.parseCurrency
    );
    interact.wager = amt;
    interact.deadline = { ETH: 100, ALGO: 100, CFX: 1000 }[stdlib.connector];
  } else {
    interact.acceptWager = async (amt) => {
      const accepted = await ask(
        `Do you accept the Contribution of ${fmt(amt)}?`,
        yesno
      );
      if (!accepted) {
        process.exit(0);
      }
    };
  }
const part = isAlice ? ctc.p.Alice : ctc.p.Bob;
  await part(interact);


  const afterAlice = await getBalance();
  

  console.log(`Alice went from ${before} to ${afterAlice}.`);
  //console.log(`Bob went from ${before} to ${afterBob}.`);

})();