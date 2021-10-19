function buildKey(address: string, chainId: string): string {
	return address + '_' + chainId + '_collection';
}

const CollectionService = {
	addCollection: (owner: string, chainId: string, contractAddress: string) => {
		let collection = CollectionService.getCollection(owner, chainId);
		if (!collection.includes(contractAddress)) {
			collection.push(contractAddress);
			localStorage.setItem(buildKey(owner, chainId), JSON.stringify(collection));
		}
	},

	getCollection: (owner: string, chainId: string): string[] => {
		return JSON.parse(localStorage.getItem(buildKey(owner, chainId)) || '[]');
	},
};

export default CollectionService;
