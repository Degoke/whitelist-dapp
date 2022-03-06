import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { providers, Contract } from 'ethers'
import Web3Modal from "web3modal";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)

  const [joinedWhitelist, setJoinedWhiteList] = useState(false)

  const [loading, setLoading] = useState(false)

  const [numWhiteListed, setNumWhiteListed] = useState(0)

  const web3modalRef = useRef()

  const getProviderOrSigner = async (needSigner=false) => {
      const provider = await web3modalRef.current.connect()
      const web3Provider = new providers.Web3Provider(provider)
      const { chainId } = await web3Provider.getNetwork()
  
      if(chainId !== 4) {
        window.alert("Change network to rinkeby")
        throw new error('Change network to rinkeby')
      }
  
      if(needSigner) {
        const signer = web3Provider.getSigner()
        return signer
      }
  
      return web3Provider
  }

  const addAddressToWhitelist = async() => {
    try {
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer)

      const tx = await whitelistContract.addAddressToWhiteList()
      setLoading(true)
      await tx.wait()
      setLoading(false)

      await getNumberOfWhitelisted()
      setJoinedWhiteList(true)

    }
    catch(error) {
      console.error(error)
    }
  }

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider)

      const _numWhiteListed = await whitelistContract.numAddressesWhitelisted()
      console.log(_numWhiteListed)
      setNumWhiteListed(_numWhiteListed)
    }
    catch(error) {
      console.error(error)
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const whitelistContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer)
      const address = await signer.getAddress()

      const _joinedWhitelist = await whitelistContract.whiteListedAddresses(address)
      setJoinedWhiteList(_joinedWhitelist)
    }
    catch(error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
      
      checkIfAddressInWhitelist()
      getNumberOfWhitelisted()
    }
    catch(error) {
      console.error(error)
    }
  }

  const renderButton = () => {
    if(walletConnected) {
      if(joinedWhitelist) {
        return (
        <div className={styles.description}>
        Thanks for joining the Whitelist!
      </div>
        )
      }
      else if(loading) {
        return <button className={styles.button}>Loading...</button>;
      }
      else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    }
    else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );

    }
  }

  useEffect(() => {
    if(!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected])

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numWhiteListed} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Degoke and crypto Devs
      </footer>
    </div>
  );
}
