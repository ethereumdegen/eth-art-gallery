/*
 

*/
 
const web3utils = require('web3').utils
const ethUtil = require('ethereumjs-util');


const permissibleTokenABI = require('../../abi/PermissibleToken.json')
 

import EIP712HelperV3 from './EIP712HelperV3'

export default class PermitUtils {


  static getPermitTypedDataHash(typedData )
  {
    var typedDataHash = web3utils.sha3(
        Buffer.concat([
            Buffer.from('1901', 'hex'),
            EIP712HelperV3.structHash('EIP712Domain', typedData.domain, typedData.types),
            EIP712HelperV3.structHash(typedData.primaryType, typedData.message, typedData.types),
        ]),
    );

    //console.log('meep 1', ethUtil.bufferToHex(EIP712HelperV3.structHash('EIP712Domain', typedData.domain, typedData.types)))
    //console.log('meep 2', ethUtil.bufferToHex(EIP712HelperV3.structHash(typedData.primaryType, typedData.message, typedData.types)))
    return typedDataHash;
  }


 
  static recoverPermitSigner(  typedData, signature){

    var sigHash = LavaPacketUtils.getLavaTypedDataHash( typedData, typedData.types);
    var msgBuf = ethUtil.toBuffer(signature)
    const res = ethUtil.fromRpcSig(msgBuf);


    var hashBuf = ethUtil.toBuffer(sigHash)

    const pubKey  = ethUtil.ecrecover(hashBuf, res.v, res.r, res.s);
    const addrBuf = ethUtil.pubToAddress(pubKey);
    const recoveredSignatureSigner    = ethUtil.bufferToHex(addrBuf);

    var message = typedData.message

    console.log('recovered signer pub address',recoveredSignatureSigner.toLowerCase())
    //make sure the signer is the depositor of the tokens
    return recoveredSignatureSigner.toLowerCase();

  }


  static getPermitTypedDataFromParams(  name, chainId, contractAddress,holder,spender,nonce,expiry,allowed  )
  {
    const typedData = {
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' }
                ],
                Permit: [
                    { name: 'holder', type: 'address' },
                    { name: 'spender', type: 'address' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'expiry', type: 'uint256' },
                    { name: 'allowed', type: 'bool' }
                ],
            },
            primaryType: 'Permit',
            domain: {
                name: name,
                version: '1',
                chainId: chainId,  
                verifyingContract: contractAddress
            },
            message: {
                holder: holder,
                spender: spender,
                nonce: nonce,
                expiry: expiry,
                allowed: allowed  
            }
        }; 


      return typedData;
  }



  static async performOffchainSignForPermit(args,web3Plug){

         

       let myTokenContract = web3Plug.getCustomContract(web3Plug.web3, permissibleTokenABI, args.tokenAddress)

       console.log('myTokenContract',myTokenContract)
 
       let nameOfToken = await myTokenContract.methods.name().call()

       let chainId = web3Plug.getConnectionState().activeNetworkId

       let expirationTime = 0;

       let currentPermitNonceResult = await myTokenContract.methods.nonces(args.permitFrom).call()
       
       let currentPermitNonce = parseInt( currentPermitNonceResult )
       

       let inputDataArray = [args.permitFrom,args.permitTo, currentPermitNonce,args.expires,args.allowed]

       const typedData = PermitUtils.getPermitTypedDataFromParams(
            nameOfToken,
            chainId,  //0x2a for Kovan
            window.web3.utils.toChecksumAddress(args.tokenAddress),  //IMPORTANT 

            ...inputDataArray  //unpack the array 
       )
        console.log('permit typedData',typedData)
 
        var stringifiedData = JSON.stringify(  typedData );

        let permitTypedDataHash = PermitUtils.getPermitTypedDataHash(typedData)



        let signResult = await  EIP712HelperV3.signTypedData( web3Plug.web3, args.permitFrom, stringifiedData  )
        
        
        signResult.tokenAddress = args.tokenAddress
        signResult.from = args.permitFrom 
        signResult.to = args.permitTo 
        signResult.expires = args.expires 
        signResult.allowed = args.allowed  
        signResult.nonce = currentPermitNonce

        console.log( 'signResult', signResult )  

        return signResult



  }

}
