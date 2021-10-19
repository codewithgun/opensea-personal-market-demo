const ERC721Collection = artifacts.require('ERC721Collection');

module.exports = async function (deployer) {
	// await deployer.deploy(ERC721Collection, 'MyEG Collection', 'MYEG');
	await deployer.deploy(ERC721Collection, 'Classical Collection 3', 'CC3');
};
