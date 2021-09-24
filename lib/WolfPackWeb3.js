import { ethers } from 'ethers';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
export default class WolfPackWeb3 {
  constructor() {
    this.web3 = new ethers.providers.Web3Provider(window.ethereum);
    // this.formatUnits = formatUnits().bind(this);
    // this.preSaleMint = preSaleMint().bind(this);
  }

  // Foramt
  formatUnits = async (value, formatTo) => {
    return ethers.utils.formatUnits(value, formatTo);
  };
  parseUnits = async (value, formatTo) => {
    return ethers.utils.parseUnits(value, formatTo);
  };
  //Get Nonce
  getNonce = async (address) => {
    try {
      const nonce = await this.web3.getTransactionCount(address, 'latest');
      console.log('The latest nonce is ' + nonce);
      return await nonce;
    } catch (error) {
      throw error;
    }
  };
  // Get Network
  static getNetwork = async (name_or_id) => {
    try {
      const network = await this.web3.getNetwork(name_or_id);
      console.log('The network is: ' + JSON.stringify(network));
      return await JSON.stringify(network);
    } catch (error) {
      throw error;
    }
  };
  // Get Balance of Address in BigNumber
  getAddress = async () => {
    const signer = this.web3.getSigner();
    return await signer.getAddress();
  };

  // Get Balance of Address in BigNumber
  getBalance = async (address) => {
    return await this.web3.getBalance(address);
  };
  //
  //
  static getGasPrice = async () => await this.web3.getGasPrice();
  //

  static signTransaction = async (transaction) => {
    const signedTx = await web3.eth.accounts.signTransaction(transaction);
    return signedTx;
  };

   sendTransaction = async (transaction) => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page

    await this.web3.sendTransaction(transaction, function (error, hash) {
      if (!error) {
        console.log(
          '🎉 The hash of your transaction is: ',
          hash,
          "\n Check Alchemy's Mempool to view the status of your transaction!"
        );
      } else {
        console.log(
          '❗Something went wrong while submitting your transaction:',
          error
        );
      }
    });
  };

  preSaleMint = async (address,amount) => {
    const _web3 = createAlchemyWeb3(
      process.env.API_URL
    );
    // this.web3 = new ethers.providers.Web3Provider(window.ethereum);
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    // const provider = new ethers.providers.Web3Provider(window.ethereum);

    // The Metamask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const contract = require("../artifacts/contracts/WolfPack.sol/WolfPack.json");
 
    const signer = await this.web3.getSigner();
    // console.log('signer', signer);
    var abi = require('./abi.json');
    const nftContract = new _web3.eth.Contract(
      abi,
      '0x08Be0024f7C6Ade544D7cCF30749e14CbAf67f4e'
    );
    console.log('nftContract', nftContract);
    let value = await this.web3.BigNumber.from(0.1 * Math.pow(amount, 18));
    const tx = {
      from: address,
      to: '0x08Be0024f7C6Ade544D7cCF30749e14CbAf67f4e',
      gas: await this.web3.getGasPrice(),
      value: ethers.utils.formatEther(value),
      maxPriorityFeePerGas: 1999999987,
      data: await nftContract.methods.preSaleMint(
        amount
      ),
    };
    await this.sendTransaction(tx);
    return data;
  };

  getNFTs = async (addr) => {
    if (this.web3 !== undefined) {
      const signer = this.web3.getSigner();
      var abi = require('../artifacts/contracts/WolfPack.sol/WolfPack.json');
      var contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        abi.abi,
        this.web3
      );
      var contractSign = await contract.connect(signer);
      return await contractSign
        .tokensOfOwner(addr)
        .then(async (res) => {
          return await res.map(async ({ _hex }) => {
            const _id = parseInt(Number(_hex), 10);
            const uri = await contractSign.tokenURI(parseInt(Number(_hex), 10));
            return { tokenID: _id, _uri: uri };
          });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      return [];
    }
  };
  getPrice = async () => {
    if (this.web3 !== undefined) {
      const signer = this.web3.getSigner();
      var abi = require('../artifacts/contracts/WolfPack.sol/WolfPack.json');
      var contract = new ethers.Contract(
        contractAddr,
        abi.abi,
        this.web3
      );
      var contractSign = await contract.connect(signer);
      var data = await contractSign.getPrice();
      return data;
    } else {
      throw new Error('Web3 is not defined');
    }
  }
  setBaseURI = async (contractAddr, uri) => {
    if (this.web3 !== undefined) {
      const signer = this.web3.getSigner();
      var abi = require('../artifacts/contracts/WolfPack.sol/WolfPack.json');
      var contract = new ethers.Contract(
        contractAddr,
        abi.abi,
        this.web3
      );
      var contractSign = await contract.connect(signer);
      var gas = await this.web3.getGasPrice();
      var data = await contractSign.setBaseURI(
        uri
      );
      const tx = {
        from: address,
        to: contractAddr,
        gas: gas,
        maxPriorityFeePerGas: 1999999987,
        data: data,
      };
      const _tx = await this.sendTransaction(tx);
      return _tx;
    } else {
      throw new Error('Web3 is not defined');
    }
  }
}
