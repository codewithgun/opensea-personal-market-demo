import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Web3 from 'web3';
import './index.css';

export interface WalletConnectProps {
	setProvider: (provider: Web3) => void;
	setConnectedAddress: (address: string) => void;
	setChainId: (chainId: string) => void;
}

export interface ConnectInfo {
	chainId: string;
}

const WalletConnectOverlay: React.FC<WalletConnectProps> = ({ setProvider, setConnectedAddress, setChainId }) => {
	const [disableConnectButton, setDisableConnectButton] = useState<boolean>(false);

	const onConnectToMetamaskClick = async () => {
		const provider = await detectEthereumProvider();
		if (provider && window.ethereum) {
			await listenMetamask(window.ethereum as MetaMaskInpageProvider);
		} else {
			alert('Please install metamask');
		}
	};

	const listenMetamask = async (ethereum: MetaMaskInpageProvider) => {
		ethereum.on('accountsChanged', (_accounts) => {
			window.location.reload();
		});

		ethereum.on('chainChanged', (chainId) => {
			window.location.reload();
		});

		try {
			const accounts = await ethereum.request<string[]>({ method: 'eth_requestAccounts' });
			if (accounts) {
				setConnectedAddress(accounts[0] || '');
			}
			if (ethereum.isConnected()) {
				setDisableConnectButton(true);
				setChainId(Number(ethereum.chainId).toString());
				//@ts-expect-error
				setProvider(new Web3(ethereum));
			}
		} catch (error) {}
	};

	return (
		<div id="walletconnect" className={`d-flex justify-content-center align-items-center ${disableConnectButton ? 'd-none' : 'd-block'}`}>
			<Button variant="primary" onClick={onConnectToMetamaskClick} disabled={disableConnectButton}>
				Connect to Metamask
			</Button>
		</div>
	);
};

export default WalletConnectOverlay;
