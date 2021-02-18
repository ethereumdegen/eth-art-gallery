const abi = require('ethereumjs-abi')
const ethUtil = require('ethereumjs-util')

const domainSchema = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
]

const permitSchema = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' }
]

const types = {
  EIP712Domain: domainSchema,
  Permit: permitSchema
}

export default class EIP712SignPermit{
 

  static dependencies(primaryType, found = []) {
  if (found.includes(primaryType)) {
    return found
  }
  if (types[primaryType] === undefined) {
    return found
  }
  found.push(primaryType)
  for (const field of types[primaryType]) {
    for (const dep of EIP712SignPermit.dependencies(field.type, found)) {
      if (!found.includes(dep)) {
        found.push(dep)
      }
    }
  }
  return found
}

static encodeData(primaryType, data) {
  const encTypes = []
  const encValues = []

  // Add typehash
  encTypes.push('bytes32')
  encValues.push(EIP712SignPermit.typeHash(primaryType))

  // Add field contents
  for (const field of types[primaryType]) {
    let value = data[field.name]
    if (field.type === 'string' || field.type === 'bytes') {
      encTypes.push('bytes32')
      value = ethUtil.keccak256(value)
      encValues.push(value)
    } else if (types[field.type] !== undefined) {
      encTypes.push('bytes32')
      value = ethUtil.keccak256(encodeData(field.type, value))
      encValues.push(value)
    } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
      throw Error('TODO: Arrays currently unimplemented in encodeData')
    } else {
      encTypes.push(field.type)
      encValues.push(value)
    }
  }

  return abi.rawEncode(encTypes, encValues)
}

static encodeType(primaryType) {
  // Get dependencies primary first, then alphabetical
  let deps = EIP712SignPermit.dependencies(primaryType)
  deps = deps.filter(t => t !== primaryType)
  deps = [primaryType].concat(deps.sort())

  // Format as a string with fields
  let result = ''
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(',')})`
  }
  return result
}

static signHash(typedData) {
  return ethUtil.keccak256(
    Buffer.concat([
      Buffer.from('1901', 'hex'),
      EIP712SignPermit.structHash('EIP712Domain', typedData.domain),
      EIP712SignPermit.structHash(typedData.primaryType, typedData.message)
    ])
  )
}

static structHash(primaryType, data) {
  return ethUtil.keccak256(EIP712SignPermit.encodeData(primaryType, data))
}

static typeHash(primaryType) {
  return ethUtil.keccak256(EIP712SignPermit.encodeType(primaryType))
}

static sign(domain, message, privateKey) {
  const typedData = {
    types,
    primaryType: 'Permit',
    domain,
    message
  }
  const sig = ethUtil.ecsign(signHash(typedData), ethUtil.toBuffer(privateKey))
  return {
    v: sig.v,
    r: ethUtil.bufferToHex(sig.r),
    s: ethUtil.bufferToHex(sig.s)
  }
}

  
}