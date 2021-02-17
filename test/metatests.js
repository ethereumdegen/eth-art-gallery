



const { expect } = require('chai')




if (permittable) {
    describe('permit', () => {
      const privateKey = '0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501210'
      const infinite = new BN('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)
      let holder
      let spender
      let nonce
      let expiry
      let allowed

      beforeEach(async () => {
        holder = '0x040b798028e9abded00Bfc65e7CF01484013db17'
        spender = accounts[9]
        nonce = await token.nonces.call(holder)
        expiry = 0
        allowed = true

        holder.toLowerCase().should.be.equal(ethUtil.bufferToHex(ethUtil.privateToAddress(privateKey)).toLowerCase()) // make sure privateKey is holder's key

        // Mint some extra tokens for the `holder`
        await token.mint(holder, '10000', { from: owner }).should.be.fulfilled
        ;(await token.balanceOf.call(holder)).should.be.bignumber.equal(new BN('10000'))
        web3.eth.accounts.wallet.add(privateKey)
        await web3.eth.sendTransaction({ from: owner, to: holder, value: oneEther })
      })
      it('should permit', async () => {
        // Holder signs the `permit` params with their privateKey
        const signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        ;(await token.allowance.call(holder, spender)).should.be.bignumber.equal(new BN('0'))

        // An arbitrary address calls the `permit` function
        const { logs } = await token.permit(
          holder,
          spender,
          nonce,
          expiry,
          allowed,
          signature.v,
          signature.r,
          signature.s
        ).should.be.fulfilled

        logs[0].event.should.be.equal('Approval')
        logs[0].args.owner.should.be.equal(holder)
        logs[0].args.spender.should.be.equal(spender)
        logs[0].args.value.should.be.bignumber.equal(infinite)

        // Now allowance is infinite
        ;(await token.allowance.call(holder, spender)).should.be.bignumber.equal(infinite)

        // The caller of `permit` can't spend holder's funds
        await token.transferFrom(holder, accounts[9], '10000').should.be.rejected
        ;(await token.balanceOf.call(holder)).should.be.bignumber.equal(new BN('10000'))

        // Spender can transfer all holder's funds
        await token.transferFrom(holder, accounts[9], '10000', { from: spender }).should.be.fulfilled
        ;(await token.balanceOf.call(holder)).should.be.bignumber.equal(new BN('0'))
        ;(await token.balanceOf.call(accounts[9])).should.be.bignumber.equal(new BN('10000'))
        ;(await token.nonces.call(holder)).should.be.bignumber.equal(nonce.add(new BN('1')))

        // The allowance is still infinite after transfer
        ;(await token.allowance.call(holder, spender)).should.be.bignumber.equal(infinite)
      })
      it('should fail when invalid expiry', async () => {
        expiry = 900

        const signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        await token.setNow(1000).should.be.fulfilled
        await token
          .permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s)
          .should.be.rejectedWith(ERROR_MSG)

        await token.setNow(800).should.be.fulfilled
        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
      })
      it('should consider expiry', async () => {
        expiry = 900

        const signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        await token.setNow(800).should.be.fulfilled
        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN(expiry))

        // Spender can transfer holder's funds
        await token.setNow(899).should.be.fulfilled
        await token.transferFrom(holder, accounts[9], '6000', { from: spender }).should.be.fulfilled
        ;(await token.balanceOf.call(holder)).should.be.bignumber.equal(new BN('4000'))
        ;(await token.balanceOf.call(accounts[9])).should.be.bignumber.equal(new BN('6000'))

        // Spender can't transfer the remaining holder's funds because of expiry
        await token.setNow(901).should.be.fulfilled
        await token.transferFrom(holder, accounts[9], '4000', { from: spender }).should.be.rejectedWith(ERROR_MSG)
      })
      it('should reset expiration on subsequent approve', async () => {
        expiry = 900
        const signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )
        await token.setNow(800).should.be.fulfilled
        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN(expiry))
        const data = await token.contract.methods.approve(spender, -1).encodeABI()
        await web3.eth.sendTransaction({ from: holder, to: token.address, data, gas: 100000 }).should.be.fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(ZERO)
      })
      it('should reset expiration on subsequent increaseAllowance', async () => {
        expiry = 900
        const signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )
        await token.setNow(800).should.be.fulfilled
        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN(expiry))
        let data = await token.contract.methods.approve(spender, -2).encodeABI()
        await web3.eth.sendTransaction({ from: holder, to: token.address, data, gas: 100000 }).should.be.fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN(expiry))
        data = await token.contract.methods.increaseAllowance(spender, 1).encodeABI()
        await web3.eth.sendTransaction({ from: holder, to: token.address, data, gas: 100000 }).should.be.fulfilled
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(ZERO)
      })
      it('should disallow unlimited allowance', async () => {
        expiry = 900
        await token.setNow(800).should.be.fulfilled

        let signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
        ;(await token.allowance.call(holder, spender)).should.be.bignumber.equal(infinite)
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN(expiry))

        // Spender can transfer holder's funds
        await token.transferFrom(holder, accounts[9], '6000', { from: spender }).should.be.fulfilled
        ;(await token.balanceOf.call(holder)).should.be.bignumber.equal(new BN('4000'))
        ;(await token.balanceOf.call(accounts[9])).should.be.bignumber.equal(new BN('6000'))

        nonce = nonce - 0 + 1
        allowed = false

        signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
        ;(await token.allowance.call(holder, spender)).should.be.bignumber.equal(new BN('0'))
        ;(await token.expirations.call(holder, spender)).should.be.bignumber.equal(new BN('0'))

        // Spender can't transfer the remaining holder's funds because of zero allowance
        await token.transferFrom(holder, accounts[9], '4000', { from: spender }).should.be.rejected
      })
      it('should fail when invalid signature or parameters', async () => {
        let signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        allowed = !allowed

        await token
          .permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s)
          .should.be.rejectedWith(ERROR_MSG)

        allowed = !allowed

        await token
          .permit(
            holder,
            spender,
            nonce,
            expiry,
            allowed,
            signature.v,
            signature.s, // here should be `signature.r` in a correct case
            signature.r // here should be `signature.s` in a correct case
          )
          .should.be.rejectedWith(ERROR_MSG)

        signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce: nonce - 0 + 1,
            expiry,
            allowed
          },
          privateKey
        )

        await token
          .permit(holder, spender, nonce - 0 + 1, expiry, allowed, signature.v, signature.r, signature.s)
          .should.be.rejectedWith(ERROR_MSG)

        signature = permitSign(
          {
            name: await token.name.call(),
            version: await token.version.call(),
            chainId: '100',
            verifyingContract: token.address
          },
          {
            holder,
            spender,
            nonce,
            expiry,
            allowed
          },
          privateKey
        )

        await token.permit(holder, spender, nonce, expiry, allowed, signature.v, signature.r, signature.s).should.be
          .fulfilled
      })
    })
  }