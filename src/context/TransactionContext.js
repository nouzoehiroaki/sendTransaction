//import {ethers} from "ethers";
import {contractAddress,contractABI} from "../utils/connect";
import {createContext, useEffect, useState} from "react";

export const TransactionContext = createContext();
const { ethers } = require("ethers");
const { ethereum } = window;
//0xBc1B4007260979Bb338186b7bBAA37CcDc15F4d1
//スマートコントラクトを取得
const getSmartContract = async () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress, 
        contractABI, 
        signer
    );
    console.log(provider,signer,transactionContract);
    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount,setCurrentAccount] = useState('');
    const [inputFormData,setInputFormData] = useState({
        addressTo: "",
        amount: "",
    });
    const handleChange = (e,name) =>{
        setInputFormData((prevInputFormData) => ({
            ...prevInputFormData,
            [name]: e.target.value,
        }));
    }
    //メタマスクと連携してるか確認する関数
    const checkMetamaskWalletConnected = async () => {
        if(!ethereum) return alert("メタマスクをインストールしてください");
        const accounts = await ethereum.request({ method: "eth_chainId"});
        console.log(accounts);
    }
    //メタマスクウォレットと連携する関数
    const connectWallet = async () => {
        if(!ethereum) return alert("メタマスクをインストールしてください");
        //メタマスクを持っていればアカウントをリクエストする(接続を開始する)
        const accounts = await ethereum.request({ method:'eth_requestAccounts'});
        console.log(accounts[0]);
        setCurrentAccount(accounts[0]);
    }
    //実際に通貨のやり取りをする
    const sendTransaction = async () => {
        if(!ethereum) return alert("メタマスクをインストールしてください");
        console.log(sendTransaction);
        const {addressTo,amount} = inputFormData;
        const transactionContract =  getSmartContract();
        const parsedAmount = ethers.utils.parseEther(amount);
        const transactionParameters = {
            gas: '0x5028', 
            to:addressTo,
            from:currentAccount,
            value:parsedAmount._hex,
        };
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params:[transactionParameters]
        });
        const transactionHash = await transactionContract.addToBlockChain(
            addressTo,
            parsedAmount,
            txHash
        );
        console.log(`ロード中・・・${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`送金に成功！${transactionHash.hash}`);
    }
    useEffect(() => {
        checkMetamaskWalletConnected();
    },[]);
    return(
        <TransactionContext.Provider 
        value={{ 
            connectWallet,
            currentAccount,
            sendTransaction,
            handleChange,
            inputFormData,
        }}>
        {children}
        </TransactionContext.Provider>
    );
}