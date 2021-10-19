const ERC721Collection = artifacts.require('ERC721Collection');

module.exports = async function (deployer) {
	await deployer.deploy(ERC721Collection, 'MyEG Collection', 'MYEG', 'ipfs://QmU9Q6a6Y3bbA4kZk5BuGDEYT2F8ckYFsrBMHGquz1FFVH');
};
