'reach 0.1';
'use strict';

const Player = {
    informTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    wager: UInt, // atomic units of currency
    deadline: UInt, // time delta (blocks/rounds)
  });
  const Bob   = Participant('Bob', {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  deploy();

  const informTimeout = () => {
    each([Alice, Bob], () => {
      interact.informTimeout();
    });
  };

  Alice.only(() => {
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
    Alice.publish(wager, deadline)
      .pay(wager);
        commit();

    Bob.only(() => {
      interact.acceptWager(wager); });
   
       Bob.pay(wager)
       .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
       transfer(wager * 2).to(Bob);
    commit();

    exit(); } );