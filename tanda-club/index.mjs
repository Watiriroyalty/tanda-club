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

    console.log(`Starting Tanda club ! as ${who}`);

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
  const deployCtc = await ask(
    `Do you want to deploy the contract? (y/n)`,
    yesno
  );
  if (deployCtc) {
    ctc = acc.deploy(backend);
    ctc.getInfo().then((info) => {
      console.log(`The contract is deployed as = ${JSON.stringify(info)}`); });
  } else {
    const info = await ask(
      `Please paste the contract information:`,
      JSON.parse
    );
    ctc = acc.attach(backend, info);
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
      `How much do you want to contribute?`,
      stdlib.parseCurrency
    );
    interact.contribution = amt;
    interact.deadline = { ETH: 100, ALGO: 100, CFX: 1000 }[stdlib.connector];
  } else {
    interact.acceptContribution = async (amt) => {
      const accepted = await ask(
        `Do you accept the contribution of ${fmt(amt)}?`,
        yesno
      );
      if (!accepted) {
        process.exit(0);
      }
    };
  }

  const part = isAlice ? backend.Alice : backend.Bob;
  await part(ctc, interact);

  const after = await getBalance();
  console.log(`Your balance is now ${after}`);

  done();
})();
