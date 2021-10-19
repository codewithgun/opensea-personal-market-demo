import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethers } from 'ethers';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import './index.css';

export interface WalletConnectProps {
	setProvider: (provider: ethers.providers.Web3Provider) => void;
	setConnectedAddress: (address: string) => void;
}

export interface ConnectInfo {
	chainId: string;
}

const WalletConnectOverlay: React.FC<WalletConnectProps> = ({ setProvider, setConnectedAddress }) => {
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
		ethereum.on('connect', (info) => {
			const { chainId } = info as ConnectInfo;
			console.log(chainId);
			if (Number(chainId) !== 4) {
				alert('Invalid chain. Please connect to rinkeby testnet');
			}
		});

		ethereum.on('accountsChanged', (_accounts) => {
			// let accounts = _accounts as string[];
			// setConnectedAddress(accounts[0] || '');
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
				//@ts-expect-error
				setProvider(new ethers.providers.Web3Provider(ethereum));
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
