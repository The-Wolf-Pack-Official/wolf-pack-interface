import {ethers} from 'ethers';
import Web3 from 'web3';
import {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Button from '../components/Button';
import Navbar from '../components/navbar';
import Modal from '../components/modal';
import Collapseable from '../components/collapseable';
import WolfPackWeb3 from '../lib/WolfPackWeb3';
import 'bootstrap/dist/css/bootstrap.min.css';

const faqJSON = require('../src/data/faq.json');
const roadmapJSON = require('../src/data/roadmap.json');
const whiteListJSON = require('../src/data/whitelist.json');

function truncateAddress(address: any) {
  try {
    return `${address.substring(0, 6).toLowerCase()}...${address
      .substring(38, 42)
      .toLowerCase()}`;
  } catch (error) {
    console.log(`truncateAddress(): ${error}`);
  }
}

interface IState {
  address: string | null;
  num_to_mint: number;
  balance: number;
  show: boolean;
}

export default function _index() {
  let Window: any;
  const router = useRouter();
  const [state, setState] = useState<IState>({
    address: null,
    num_to_mint: 0,
    balance: 0,
    show: false,
  });
  let _web3: any, _signer: any, _WolfPackWeb3: any;
  const [show, setShow] = useState(false);
  const [num_to_mint, setNumToMint] = useState<any>(0);
  const [error, setError] = useState<any>('');
  async function preRelase(address: string, amount: number) {
    var abi = require('../lib/abi.json');
    const wolfContract = new window.web3.eth.Contract(
      abi,
      '0x3302F0674f316584092C15B865b9e5C8f10751D2'
    );
    const price = 0.1 * 10 ** 18 * amount;
    console.log(price);
    const gasAmount = await wolfContract.methods
      .preMint(amount)
      .estimateGas({from: address, value: price});
    // console.log('estimated gas', gasAmount);

    wolfContract.methods
      .preMint(amount)
      .send({from: address, value: price, gas: String(gasAmount)})
      .on('transactionHash', function (hash: any) {
        console.log('transactionHash', hash);
      })
      .catch(function (error: any) {
        setError(error.message);
      });
  }
  async function mint(address: string, amount: number) {
    var abi = require('../lib/abi.json');
    const wolfContract = new window.web3.eth.Contract(
      abi,
      '0x3302F0674f316584092C15B865b9e5C8f10751D2'
    );
    const price = 0.1 * 10 ** 18 * amount;
    console.log({from: address, value: price});
    let options: any = {
      from: address,
      price: price,
    };

    // const gasEstimate = await wolfContract.methods
    //   .mint(amount)
    //   .estimateGas(options);

    // options = {
    //  ...options,
      // gas: String(1.2 * gasEstimate),
    // };
    // console.log('estimated gas', String(1.2 * gasEstimate));
    
    
    // var gasLimit = 200000;
    // if
    
    
    wolfContract.methods
      .mint(amount)
      .send(options)
      .on('transactionHash', function (hash: any) {
        console.log('transactionHash', hash);
      })
      .catch(function (error: any) {
        setError(error.message);
      });
  }
  useEffect(() => {
    let {ethereum, web3}: any = window;
    if (ethereum) {
      window.web3 = new Web3(ethereum);
      handleEthereum();
    } else {
      window.addEventListener('ethereum#initialized', handleEthereum, {
        once: true,
      });

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(handleEthereum, 3000); // 3 seconds
    }
    async function handleEthereum() {
      if (ethereum && ethereum.isMetaMask) {
        // Access the decentralized web!
        ethereum.request({method: 'eth_requestAccounts'});
        try {
          _WolfPackWeb3 = new WolfPackWeb3();

          let balance: any;
          let address: any = await _WolfPackWeb3.getAddress();
          if (address.length > 0) {
            balance = await _WolfPackWeb3.getBalance(address);
          }
          console.log({address, balance});
          await setState({
            ...state,
            address: address,
            balance:
              Math.ceil(
                (await _WolfPackWeb3.formatUnits(balance, 'ether')) * 5555
              ) / 5555,
          });
        } catch (error) {
          console.log(error);
        }

        ethereum.on(
          'accountsChanged',
          async (newAccounts: string[] | number | any) => {
            if (newAccounts > 0) {
              let address: any = await newAccounts[0];

              setState({
                ...state,
                address: address,
              });
            } else {
              setState({
                ...state,
                address: null,
              });
            }
          }
        );
      } else {
        console.log('Please install MetaMask!');
      }
    }
  }, [state.address]);
  return (
    <div className={`home h-100`}>
      <style global jsx>
        {`
          html,
          body,
          #__next {
            font-family: Inter;
            font-size: 1.2rem;
            height: 100%;
            background-color: #1f1f1f;
            background-image: url('/img/BG2.png');
          }
          p,
          li {
            list-style: none;
            font-size: 1rem;
          }
          .home > div:first-child {
            height: 2.8125rem !important;
          }

          .roadmap-text {
            color: #fff;
            font-size: 2rem;
            font-weight: bold;
            z-index: 4;
            top: 30px;
            left: 35px;
          }

          .minting-section {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            width: 100%;
            min-width: 360px;
            max-width: 640px;
            border: 2px solid #000;
          }
          .header-section {
            color: #fff;
            position: relative;
            max-height: 900px;
            background-image: url('/img/BG.png');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            z-index: 2;
          }

          .header-section-text {
            max-width: 654px;
            min-height: 515px;
          }
          .img-section {
            z-index: -2;
          }
          .mint-button-style {
            background: #f05842;
            color: #fff;
          }
          .roadmap-line{
            left:66px;
            max-height:250px;
            z-index -1;
          }
          .reverse-image {
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
          }
          .modal-body {
            width: 512px;
            height: 562px;
            color: #fff;
            background-color: #1f1f1f;
          }
          .img-container text-capitalize {
            max-width: 300px;
            max-height: 300px;
          }
          .howto-img-container text-capitalize {
            max-width: 200px;
            max-height: 200px;
          }
          .footer-item,
          .footer-item p {
            cursor: pointer;
            font-size: 16px;
            min-height: 30px;
          }
          .active-item{
            margin: 0 2.3rem;
          }
          .main-fnt{
            color:#CE8500;
          }
          @media (max-width: 768px) {
            .header-section-text > p {
              font-size: 18px;
            }
          }
        `}
      </style>
      <Image
        height={'5'}
        width={'100'}
        className={'top-banner'}
        layout={'responsive'}
        src='/img/Clock.png'
      />
      {/* HEADER */}
      <div className={`header-section mb-0 pb-0 d-flex flex-column`}>
        <Navbar
          address={
            state.address !== undefined && state.address !== null
              ? truncateAddress(state.address)
              : null
          }
        />
        <div
          className={`header-section-desktop d-none d-xl-flex flex-column justify-content-between align-items-center px-3 position-relative h-100`}>
          <span
            className={`header-section-text d-flex flex-column justify-content-start text-center h-100 w-100`}>
            <h1 className={`mb-4 text-capitalize`}>The Wolf Pack</h1>
          </span>
          <div
            className={`img-section pt-5 position-absolute d-flex flex-row justify-content-between align-items-end w-100 h-100`}>
            <Image
              src={`/img/TIGER WOLF.png`}
              className={'pt-5'}
              height={'550'}
              width={'550'}
              layout={`fixed`}
            />
            <Image
              src={`/img/Intro-Wolf.png`}
              className={'pt-5 reverse-image'}
              height={'550'}
              width={'550'}
              layout={`fixed`}
            />
          </div>
        </div>

        <div
          className={`header-section-mobile d-xl-none  flex-row align-items-start h-100`}>
          <div className='d-flex flex-column justify-content-between h-100'>
            <span className={`text-center w-100`}>
              <h1 className={`mb-4 text-capitalize`}>The Wolf Pack</h1>
            </span>
            <div
              className={`img-section d-flex flex-row justify-content-between w-100`}>
              <Image
                src={`/img/TIGER WOLF.png`}
                className={''}
                height={'400'}
                width={'400'}
                layout={`intrinsic`}
              />
              <Image
                src={`/img/Intro-Wolf.png`}
                className={'reverse-image'}
                height={'400'}
                width={'400'}
                layout={`intrinsic`}
              />
            </div>
          </div>
        </div>
      </div>
      {/* WELCOME SECTION */}
      {
        <div
          className={`container d-flex flex-column justify-content-between
            align-itens-center p-5 text-white`}>
          <h1>How many Wolves would you like to mint?</h1>
          <div className={`d-flex flex-column`}>
            <label htmlFor='minter-input mb-2'>
              Number of Wolves: {num_to_mint}
            </label>
            <input
              id={`minter-input`}
              type={`range`}
              min={0}
              max={20}
              value={num_to_mint}
              onChange={(e) => {
                parseInt(e.target.value, 10) >= 0 &&
                  parseInt(e.target.value, 10) <= 20 &&
                  setNumToMint(e.target.value);
              }}
            />
            <p className={`fw-lighter mt-3`}>
              This is the number of Wolves you intend to mint. Maximum of {20}{' '}
              per transaction.
            </p>
            <p>{error}</p>
          </div>
          <Button
            buttonStyle={`mint-button-style text-uppercase mt-4 px-5`}
            onPress={async () => {
              _WolfPackWeb3 = new WolfPackWeb3();
              let arr = [];
              for (var addy of whiteListJSON) {
                arr.push(addy.toLowerCase());
              }
              // preRelase(state.address, num_to_mint);
              mint(state.address, num_to_mint);
            }}>
            Mint
          </Button>
        </div>
      }
      <div
        className={`container mx-auto welcome-section  d-flex flex-column m-5 px-3`}>
        <h2 className={`text-capitalize text-white text-center mt-4`}>
          Welcome to The Wolf Pack
        </h2>
        <div className={`d-flex flex-column flex-lg-row align-items-center`}>
          <div className={`col rounded p-2 p-lg-5`}>
            <img
              src={`/img/welcom.png`}
              className={'h-100 w-100 order-1 order-lg-0 mb-4 mb-lg-3  p-lg-5'}
            />
          </div>
          <p className={`text-white col order-0 order-lg-1`}>
            The first mistake society made was thinking that we were one of
            their sheep! In a world full of lions and tigers entertaining the
            masses, have you ever seen a wolf performing in a circus? We are the
            1% join the Wolf Pack and never run alone again...
          </p>
        </div>
      </div>
      {/* ROADMAP */}
      <div
        className={`container mx-auto road-map-section  d-flex flex-column m-5`}>
        <h2 className={`text-capitalize text-white text-center`}>
          $-10DEN coin V1 roadmap
        </h2>
        <div className={`d-flex flex-row position-relative`}>
          <div className={`d-flex flex-column col-lg-7`}>
            {roadmapJSON.map((item: any, index: number) => {
              return (
                <div
                  className={`my-4 text-white d-inline-flex flex-row justify-content-start align-items-center w-100 position-relative`}
                  key={index}>
                  <img
                    src={`/img/line-center.png`}
                    className={`position-absolute roadmap-line d-none d-sm-block`}
                  />
                  <img
                    src={
                      index == 0 ? `/img/active-item.png` : `/img/inactive.png`
                    }
                    className={
                      `${index == 0 ? 'active-item' : `mx-5`}` +
                      ' d-none d-sm-block'
                    }
                  />
                  <div className={'m-0 d-flex flex-column'}>
                    <h5
                      className={`text-capitalize ${
                        index == 0 ? `main-fnt` : ''
                      }`}>
                      {item.header}
                    </h5>
                    <br />
                    <p>{item.task}</p>
                    <p>{item.subTask}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={
              'd-none d-lg-block roadmap-img position-absolute bottom-0 end-0 col-5'
            }>
            <img
              className={`h-100 w-100 reverse-image`}
              src={`/img/CHEETAH WOLF.png`}
            />
          </div>
        </div>
      </div>
      {/* EARLY HOLDER */}
      <div
        className={`container mx-auto mt-4 royalties-section d-flex flex-column m-5 px-3 text-white `}>
        <h2 className={`text-capitalize text-white text-center`}>
          Early Holders Get Fed
        </h2>
        <p className={`text-center`}>
          7% tax on all sells after minting is completed
        </p>
        <p className={`text-center`}>Breakdown:</p>
        <div
          className={`d-flex flex-column flex-lg-row justify-content-between align-items-center text-center`}>
          <div
            className={`col d-flex flex-column  align-items-center justify-content-center m-2`}>
            <img
              src={`/img/002-money.png`}
              className={`img-container text-capitalize h-100 w-100`}
            />
            <p>3% Lifetime royalties to Minters</p>
          </div>
          <div
            className={`col d-flex flex-column align-items-center justify-content-center m-2`}>
            <img
              src={`/img/001-commission.png`}
              className={`img-container text-capitalize h-100 w-100`}
            />
            <p>2% Reflection to holders</p>
          </div>
          <div
            className={`col d-flex flex-column align-items-center justify-content-center m-2`}>
            <img
              src={`/img/003-bullhorn.png`}
              className={`img-container text-capitalize h-100 w-100`}
            />
            <p>2% Marketing</p>
          </div>
        </div>
      </div>
      {/* FAQ */}
      <div
        id='faq'
        className={`container mx-auto faq-section  d-flex flex-column m-5 px-3`}>
        <h2 className={`text-capitalize text-white text-center`}>
          Frequently Asked Questions
        </h2>
        {faqJSON.map(
          ({title, content}: {title: string; content: string}, key: number) => (
            <Collapseable title={title} content={content} key={key} />
          )
        )}
      </div>
      {/* HOW TO MINT */}
      <div
        className={`container mx-auto mt-4 howto-minting-section d-flex flex-column m-5 px-3 text-white `}>
        <h2 className={`text-capitalize text-white text-center`}>
          How to Mint
        </h2>
        <div
          className={`d-flex flex-column justify-content-between align-items-center text-center`}>
          <div
            className={`d-flex flex-column flex-lg-row justify-content-around w-100`}>
            <div
              className={`col d-flex flex-column justify-content-center  m-2 info-container h-100 w-100 text-center`}>
              <img
                src={`/img/howto_1.png`}
                className={`howto-img-container text-capitalize mx-auto h-100 w-100`}
              />
              <p>Connect your MetaMask</p>
            </div>
            <div
              className={`col d-flex flex-column justify-content-center  m-2 info-container h-100 w-100`}>
              <img
                src={`/img/howto_2.png`}
                className={`howto-img-container text-capitalize mx-auto h-100 w-100`}
              />
              <p>Click the Mint Button</p>
            </div>
            <div
              className={`col d-flex flex-column justify-content-center  m-2 info-container h-100 w-100`}>
              <img
                src={`/img/howto_3.png`}
                className={`howto-img-container text-capitalize mx-auto h-100 w-100`}
              />
              <p>
                Approve 0.1 ETH + gas <br /> fee transaction
              </p>
            </div>
          </div>
          <div
            className={`d-flex flex-column flex-lg-row justify-content-around w-100`}>
            <div
              className={`col d-flex flex-column justify-content-center  m-2 info-container h-100 w-100`}>
              <img
                src={`/img/howto_4.png`}
                className={`howto-img-container text-capitalize mx-auto h-100 w-100`}
              />
              <p>
                Wait until reveal and then make your <br /> NFT your social
                avatar and tag us
              </p>
            </div>
            <div
              className={`col d-flex flex-column justify-content-center  m-2 info-container h-100 w-100`}>
              <img
                src={`/img/howto_5.png`}
                className={`howto-img-container text-capitalize mx-auto h-100 w-100`}
              />
              <p>Hodl for moon mission</p>
            </div>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <div
        className={`navbar d-flex flex-column flex-lg-row justify-content-between align-items-center p-3 text-white`}>
        <a
          className='brand footer-item text-uppercase text-decoration-none text-white'
          onClick={() => router.push('/')}>
          <img src='/img/Logo.png' alt='logo' className='logo' />
        </a>

        <div
          className={`d-flex flex-column justify-content-around align-items-center flex-fill flex-lg-row p-3 mt-3 mt-lg-0 text-white`}>
          <div onClick={() => router.push('/')} className={`footer-item my-3`}>
            Home
          </div>
          <div
            onClick={() => router.push('https://t.co/uInJBgtWGD?amp=1')}
            className={`footer-item my-3`}>
            Discord
          </div>
          <div
            onClick={() =>
              router.push('https://twitter.com/thewolfpacknft?s=20')
            }
            className={`footer-item my-3`}>
            Twitter
          </div>
          <div
            onClick={() => router.push('https://t.co/zQnrdKLRAf?amp=1')}
            className={`footer-item my-3`}>
            Instagram
          </div>
          <div
            onClick={() => router.push('/#faq')}
            className={`footer-item my-3 `}>
            FAQ
          </div>
        </div>
        <div className={`social-icons`}></div>
      </div>

      <hr className={`border border-white`} />
      <div className={`w-100 p-3`}>
        <p className={`text-center text-white`}>Copyright © 2021 </p>
      </div>
    </div>
  );
}
