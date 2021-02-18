/*
 

*/
 


export default class PermitUtils {




 


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
