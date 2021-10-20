import { OpenSeaPort } from 'opensea-js';
import { useEffect, useState } from 'react';
import { Button, Container, Dropdown, DropdownButton, Form, Table } from 'react-bootstrap';
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import ERC721 from '../../contract/ERC721';
import { ipfs } from '../../services/ipfs.service';

export interface MintProps {
	collectionAddress: string[];
	provider: Web3 | undefined;
	connectedAddress: string;
	opensea: OpenSeaPort | undefined;
}

export interface IAttribute {
	trait_type: string;
	value: string;
}

const Mint: React.FC<MintProps> = ({ collectionAddress, provider, connectedAddress, opensea }) => {
	const [selectedContract, setSelectedContract] = useState<string>('Select contract');
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [externalLink, setExternalLink] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [attributes, setAttributes] = useState<IAttribute[]>([]);
	const [newAttribute, setNewAttribute] = useState<string>('');
	const [newAttributeValue, setNewAttributeValue] = useState<string>('');
	const [price, setPrice] = useState<string>('');

	useEffect(() => {
		console.log('Attributes', attributes);
	}, [attributes]);

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files !== null && e.target.files.length) {
			setFile(e.target.files[0]);
		}
	};

	const onNewAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewAttribute(e.target.value);
	};

	const onNewAttributeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewAttributeValue(e.target.value);
	};

	const onAddAttributeClick = () => {
		if (newAttribute && newAttributeValue) {
			setAttributes([
				...attributes,
				{
					trait_type: newAttribute,
					value: newAttributeValue,
				},
			]);
			setNewAttribute('');
			setNewAttributeValue('');
		}
	};
	const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPrice(e.target.value);
	};

	const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDescription(e.target.value);
	};

	const onExternalLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setExternalLink(e.target.value);
	};

	const onContractSelect = (eventKey: string | null, e: React.SyntheticEvent<unknown>) => {
		setSelectedContract(eventKey || '');
	};

	const onCreateClick = async () => {
		if (!selectedContract) {
			alert('Please select collection');
			return;
		}
		if (!name || !description || !externalLink || !file) {
			alert('Please fill in all fields');
			return;
		}
		if (Number.isNaN(Number(price))) {
			alert('Invalid price');
			return;
		}
		if (provider) {
			let fileHash: string = '';
			if (file) {
				console.log('Uploading file');
				fileHash = await ipfs.add(file).then((r) => r.cid.toString());
				console.log('File hash', fileHash);
			}
			console.log('Uploading token URI');
			const tokenUriHash = await ipfs
				.add(
					JSON.stringify({
						name,
						description,
						image: `ipfs://${fileHash}`,
						external_url: externalLink,
						attributes,
					}),
				)
				.then((r) => r.cid.toString());
			console.log('TokenURI hash', tokenUriHash);
			const [address] = selectedContract.split('_');
			//@ts-ignore
			const contract = new provider.eth.Contract(ERC721.abi, address);
			contract.methods
				.mint(connectedAddress, `ipfs://${tokenUriHash}`)
				.send({
					from: connectedAddress,
				})
				.on('receipt', (receipt: TransactionReceipt) => {
					if (receipt) {
						alert('Mint success');
						//@ts-ignore
						let tokenId = receipt.events['Transfer'].returnValues['tokenId'];
						console.log('TokenId', tokenId);
						if (opensea) {
							opensea
								.createSellOrder({
									accountAddress: connectedAddress,
									asset: {
										tokenId,
										tokenAddress: address,
									},
									startAmount: Number(price),
									endAmount: Number(price),
								})
								.then((result) => {
									alert('Successfully listed');
									console.log('Listing', result);
								})
								.catch(console.error);
						}
					}
				});
		}
	};

	return (
		<Container>
			<h3>Create Item</h3>
			<DropdownButton title={selectedContract} id="dropdown-menu-align-right" onSelect={onContractSelect}>
				{collectionAddress.map((e) => {
					const [address, collectionName] = e.split('_');
					return (
						<Dropdown.Item eventKey={e} key={address}>
							{collectionName}
						</Dropdown.Item>
					);
				})}
			</DropdownButton>
			<Form.Group>
				<Form.Label>Name</Form.Label>
				<Form.Control type="text" placeholder="Enter item name" onChange={onNameChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Description</Form.Label>
				<Form.Control type="text" placeholder="Enter item description" onChange={onDescriptionChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>File</Form.Label>
				<Form.Control type="file" placeholder="Upload item file" onChange={onFileChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>External Link</Form.Label>
				<Form.Control type="text" placeholder="Enter item external link" onChange={onExternalLinkChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Attributes</Form.Label>
				<Table>
					<thead>
						<tr>
							<th>Attribute</th>
							<th>Value</th>
							<th>#</th>
						</tr>
					</thead>
					<tbody>
						{attributes.map((att, i) => {
							return (
								<tr key={i}>
									<td>{att.trait_type}</td>
									<td>{att.value}</td>
								</tr>
							);
						})}
						<tr>
							<td>
								<Form.Control type="text" placeholder="Attribute" onChange={onNewAttributeChange} value={newAttribute} />
							</td>
							<td>
								<Form.Control type="text" placeholder="Value" onChange={onNewAttributeValueChange} value={newAttributeValue} />
							</td>
							<td>
								<Button variant="success" onClick={onAddAttributeClick}>
									Add
								</Button>
							</td>
						</tr>
					</tbody>
				</Table>
			</Form.Group>
			<Form.Group>
				<Form.Label>Price</Form.Label>
				<Form.Control type="text" placeholder="Enter price" onChange={onPriceChange} />
			</Form.Group>
			<Form.Group>
				<Button variant="primary" onClick={onCreateClick}>
					Create
				</Button>
			</Form.Group>
		</Container>
	);
};

export default Mint;
