
 ## Meta Transactions Portal


 This dapp lets you transfer XDAI tokens with Meta Transactions


#### TODO 
https://www.xdaichain.com/for-developers/developer-resources/meta-transactions

https://kovan.etherscan.io/address/0xf5b71f8d25d3e90b9ec0c08d890853187df4bef4#writeContract


//https://github.com/poanetwork/tokenbridge-contracts/tree/master/test/helpers
integrate eip712-sign-permit


1. Make permit work 


2. Make lava transfer work 




![image](https://user-images.githubusercontent.com/6249263/72673879-ed7c8c00-3a3d-11ea-8aa0-df98f0cff530.png)


 This application uses EIP712 and PersonalSign in order to allow you to sign an 'offchain packet of data' which contains data describing a transaction that you want to be performed, like transferring ERC20 tokens.  


Relays can pay gas to submit the signed 'datagram' to the EVM network  
  

## How to Run
1. install node8
2. install dependencies with 'npm install'
3.  npm run dev



  You can run the tests for the truffle contract at https://github.com/admazzola/lava-wallet






## HOW TO TEST
npm run dev
