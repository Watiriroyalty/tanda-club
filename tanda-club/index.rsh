'reach 0.1';

const Player = {
  informTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    contribution: UInt, // atomic units of currency
    deadline: UInt, // time delta (blocks/rounds)
  });

  const Bob   = Participant('Bob', {
    ...Player,
    acceptContribution: Fun([UInt], Null),
  });
  deploy();

  const informTimeout = () => {
    each([Alice, Bob], () => {
      interact.informTimeout();
    });
  };
  Alice.only(() => {
    const contribution = declassify(interact.contribution);
    const deadline = declassify(interact.deadline);
  });
  
  Alice.publish(contribution, deadline)
    .pay(contribution);
  commit();
  Bob.only(() => {
    interact.acceptContribution(contribution);
  });
  Bob.pay(contribution)
    .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
    commit();
 
});
