import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import Web3 from 'web3';
import ERC721 from '../../contract/ERC721';
import { ipfs } from '../../services/ipfs.service';

export interface CollectionProps {
	provider: Web3 | undefined;
	connectedAddress: string;
	addCollectionAddress: (addresses: string, collectionName: string) => void;
}

const Collection: React.FC<CollectionProps> = ({ provider, connectedAddress, addCollectionAddress }) => {
	const [progress, setProgress] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [symbol, setSymbol] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [externalLink, setExternalLink] = useState<string>('');

	const onCreateClick = async () => {
		if (provider) {
			if (!name || !symbol || !description || !imageFile || !externalLink) {
				alert('Please fill in all fields');
				return;
			}
			// @ts-ignore
			const contract = new provider.eth.Contract(ERC721.abi);
			let logoHash = '';
			if (imageFile) {
				setProgress('Uploading logo to IPFS');
				console.log('Uploading logo to IPFS');
				logoHash = await ipfs.add(imageFile).then((r) => r.cid.toString());
				console.log('Logo', logoHash);
				setProgress('Logo upload completed');
			}
			setProgress('Uploading contract uri to IPFS');
			console.log('Uploading contract uri');
			const contractUriHash = await ipfs
				.add(
					JSON.stringify({
						name,
						description,
						image: logoHash,
						external_link: externalLink,
					}),
				)
				.then((r) => r.cid.toString());
			console.log('ContractURI', contractUriHash);
			setProgress('Contract URI upload completed');
			setProgress('Deploying contract');
			contract
				.deploy({
					data: ERC721.bytecode,
					arguments: [name, symbol, `ipfs://${contractUriHash}`],
				})
				.send({
					from: connectedAddress,
				})
				.on('receipt', (receipt) => {
					//@ts-ignore
					if (receipt.contractAddress) {
						alert('Completed');
						setProgress('');
						addCollectionAddress(receipt.contractAddress, name);
					}
				})
				.catch((error) => {
					setProgress(error.message);
				});
		}
	};

	const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files !== null && e.target.files.length) {
			setImageFile(e.target.files[0]);
		}
	};

	const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const onSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSymbol(e.target.value);
	};

	const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(e.target.value);
	};

	const onExternalLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setExternalLink(e.target.value);
	};

	return (
		<Container>
			<h3>Create Collection</h3>
			<span className="small">{progress}</span>
			<Form.Group>
				<Form.Label>Name</Form.Label>
				<Form.Control type="text" placeholder="Enter collection name" onChange={onNameChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Symbol</Form.Label>
				<Form.Control type="text" placeholder="Enter collection symbol" onChange={onSymbolChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Description</Form.Label>
				<Form.Control type="text" placeholder="Enter collection description" onChange={onDescriptionChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Logo</Form.Label>
				<Form.Control type="file" placeholder="Upload collection logo" onChange={onLogoChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>External Link</Form.Label>
				<Form.Control type="text" placeholder="Enter collection external link" onChange={onExternalLinkChange} />
			</Form.Group>
			<Form.Group>
				<Button variant="primary" onClick={onCreateClick} className="mt-1">
					Create
				</Button>
			</Form.Group>
		</Container>
	);
};

export default Collection;
