function buildCollectionKey(address: string): string {
	return `${address}_collection`;
}

export const CollectionService = {
	getCollection: (address: string): string[] => {
		let collections = localStorage.getItem(buildCollectionKey(address));
		return collections ? JSON.parse(collections) : [];
	},
    
	addCollection: (address: string, collectionAddress: string) => {
		localStorage.setItem(buildCollectionKey(address), '[]');
	},
};
