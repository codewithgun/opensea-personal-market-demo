import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WalletConnectOverlay from './components/walletconnect';
import { ethers } from 'ethers';
import NavBarWrapper from './components/navbar';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './components/home';
import { OpenSeaPort, Network } from 'opensea-js';

function App() {
	const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
	const [connectedAddress, setConnectedAddress] = useState<string>('Not connected');

	useEffect(() => {
		if (provider) {
			const opensea = new OpenSeaPort(provider, {
				networkName: Network.Rinkeby,
			});
			console.log(opensea);
		}
	}, [provider]);
    
	return (
		<div id="app">
			<Router>
				<NavBarWrapper address={connectedAddress} />
				<WalletConnectOverlay setProvider={setProvider} setConnectedAddress={setConnectedAddress} />
				<Switch>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
