import 'bootstrap/dist/css/bootstrap.min.css';
import { Network, OpenSeaPort } from 'opensea-js';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Collection from './components/collection';
import Home from './components/home';
import NavBarWrapper from './components/navbar';
import WalletConnectOverlay from './components/walletconnect';
import CollectionService from './services/collection.service';

function App() {
	const [collectionAddress, setCollectionAddress] = useState<string[]>([]);
	const [provider, setProvider] = useState<Web3 | undefined>(undefined);
	const [opensea, setOpensea] = useState<OpenSeaPort | undefined>(undefined);
	const [connectedAddress, setConnectedAddress] = useState<string>('Not connected');
	const [chainId, setChainId] = useState<string>('');

	useEffect(() => {
		console.log('Collection', collectionAddress);
	}, [collectionAddress]);

	useEffect(() => {
		setCollectionAddress(CollectionService.getCollection(connectedAddress, chainId));
	}, [connectedAddress]);

	useEffect(() => {
		if (provider) {
			const opensea = new OpenSeaPort(provider.currentProvider, {
				networkName: Network.Rinkeby,
			});
			setOpensea(opensea);
		}
	}, [provider]);

	const addCollectionAddress = (address: string) => {
		CollectionService.addCollection(connectedAddress, chainId, address);
		setCollectionAddress(CollectionService.getCollection(connectedAddress, chainId));
	};

	return (
		<BrowserRouter>
			<div id="app">
				<NavBarWrapper address={connectedAddress} />
				<WalletConnectOverlay setProvider={setProvider} setConnectedAddress={setConnectedAddress} setChainId={setChainId} />
				<Switch>
					<Route path="/" exact={true}>
						<Home />
					</Route>
					<Route path="/collection" exact={true}>
						<Collection provider={provider} connectedAddress={connectedAddress} addCollectionAddress={addCollectionAddress} />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
