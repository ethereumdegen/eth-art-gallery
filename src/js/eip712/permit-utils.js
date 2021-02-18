/*
 

*/
 
const web3utils = require('web3').utils
const ethUtil = require('ethereumjs-util');

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

    console.log('meep 1', ethUtil.bufferToHex(EIP712HelperV3.structHash('EIP712Domain', typedData.domain, typedData.types)))
    console.log('meep 2', ethUtil.bufferToHex(EIP712HelperV3.structHash(typedData.primaryType, typedData.message, typedData.types)))
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


}
