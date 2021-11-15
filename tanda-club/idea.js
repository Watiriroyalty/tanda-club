/*

//WATIRI
The main idea is to create a rotating savings club where 
each participant contributes a certain amount of money(token) after a certain period of time.

1. PROBLEM ANALYSIS
 Q: WHO IS INVOLVED IN THIS APPLICATION? 

 A: A group of friends that want to save money and decide who gets the cumulative amount at the end of the month. A relay account where all the money is stored and is transfered to the person appointed to receive the money.

 Basically a receiver Bob to get the money at the end of the month and a contributor Alice that initiates a fund transfer.

 Q: WHAT INFORMATION ARE THEY GOING TO DISCOVER AND USE IN THE PROGRAM? 

 A: The relay account will learn the address of the person to receive the funds


 Q:WHAT FUNDS CHANGE OWNERSHIP DURING THE APPLICATION AND HOW?

 A: The funds change ownership when someone in the tanda club draws the contributed amount. Funds transferred from Alice to BOb under the instruction of the Relay account.

 DATA DEFINITION

 Bobs account: Address
 Alice amount: UInt
 Relay account: getRelay


 2. COMMUNICATION CONSTRUCTION
 
 A: *Alice comes up with the amount that she wants to contribute
 *Alice pays the amount and says who the relay is.
 * The consensus remembers who the relay is.
 * The relay publishes Bob's address
 * The consensus transfers the amount to Bob





 3. ASSERTION INSERTION

 The transfer only happens when Bob's address is knowable and requires a password match.




 4. INTERACTION INTRODUCTION

  Reach programmer needs to insert calls into their code to send data to and from the frontend via the participant interact interfaces that they defined during the Data Definition step.



 5. DEPLOYMENT DECISION

This application will be deployed  on Algo main net. 




*/