const assert = require('assert');

const ERC721Collection = artifacts.require('ERC721Collection');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('ERC721', function (accounts) {
	let contract, newTokenId;
	const ipfsHash = 'ipfs://QmfMGDjV5rfohHmdR3V3YasvskokLMF5y3MgNgTZyYL7wa';

	beforeEach(async () => {
		contract = await ERC721Collection.deployed();
	});

	it('should deploy contract', async function () {
		const address = contract.address;
		console.log('Contract address', address);
		assert.notEqual(address, '');
	});

	it('should be MyEg collection', async function () {
		const symbol = await contract.symbol();
		const name = await contract.name();
		console.log('Symbol', symbol);
		console.log('Name', name);
		assert.equal(name, 'MyEG Collection');
		assert.equal(symbol, 'MYEG');
	});

	describe('mint new token', async function () {
		it('should create new token', async function () {
			const mintResult = await contract.mint(accounts[1], ipfsHash);
			assert.equal(mintResult.receipt.logs[0].args['to'], accounts[1]);
			newTokenId = mintResult.receipt.logs[0].args['tokenId'].toString();
		});
	});

	describe('new token owner', async function () {
		it('should be account 2', async function () {
			const owner = await contract.ownerOf(newTokenId);
			assert.equal(owner, accounts[1]);
		});
	});

	describe('new token uri', async function () {
		it('should be QmfMGDjV5rfohHmdR3V3YasvskokLMF5y3MgNgTZyYL7wa', async function () {
			const tokenUri = await contract.tokenURI(newTokenId);
			assert.equal(tokenUri, ipfsHash);
		});
	});

	describe('get invalid token uri', async function () {
		it('should return empty', async function () {
			try {
				await contract.tokenURI(Math.max);
			} catch (error) {
				assert.equal(error.message.includes('ERC721Metadata: URI query for nonexistent token'), true);
			}
		});
	});
});
