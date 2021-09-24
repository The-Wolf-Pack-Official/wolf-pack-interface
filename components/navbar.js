import Button from './Button';
import Web3 from "web3";
import { useRouter } from 'next/router';
async function handleEthereum() {
  const { ethereum } = window;
  if (ethereum && ethereum.isMetaMask) {
    console.log('Ethereum successfully detected!');
    window.web3 = new Web3(window.ethereum);
    // Access the decentralized web!
    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
          // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
          .then((network) => { console.log(network); if (network != "main") { alert("You are on " + network + " network. Change network to mainnet or you won't be able to do anything here") } });
      });
  } else {
    console.log('Please install MetaMask!');
  }
}
function NavItem(props) {
  return <><style jsx>{`.nav-item{cursor:pointer;}`}</style><div onClick={props.onPress} className={`nav-item d-none d-xl-block`}>{props.Page}</div></>;
}

function Navbar(props) {
  const router = useRouter();
  return (
    <>
      <style global jsx>{`
        .navbar {
          color: #fff;
          background-color: transparent !important;
          min-height: 75px;
        }
        .brand{cursor:pointer;}
        .btn-wolf{background-color:#f05842;color:#000;border:1px solid #000;}
      `}</style>
      <nav className='navbar navbar-expand-lg d-flex flex-row align-items-center px-3'>
        <div
          className={`w-100 d-flex flex-row justify-content-between align-items-center`}>
          <a
            className='brand text-uppercase h-100 text-decoration-none text-white'
            onClick={() => router.push('/')}>
            <img src='/img/Logo.png' alt='logo' className='logo' />
          </a>
          <NavItem Page='Home' onPress={() => router.push('/')} />
          <NavItem Page='Discord' onPress={() => router.push('https://t.co/uInJBgtWGD?amp=1')} />
          <NavItem Page='Twitter' onPress={() => router.push('https://twitter.com/thewolfpacknft?s=20')} />
          <NavItem Page='FAQ' onPress={() => router.push('/#faq')} />
          {props.address == null ? (
            <Button
              buttonStyle={`text-white btn-wolf`}
              onPress={async () => {
                const { ethereum } = window;
                if (ethereum !== undefined) {
                  // eslint-disable-line
                  handleEthereum();
                } else {
                  window.addEventListener(
                    'ethereum#initialized',
                    handleEthereum,
                    {
                      once: true,
                    }
                  );

                  // If the event is not dispatched by the end of the timeout,
                  // the user probably doesn't have MetaMask installed.
                  setTimeout(handleEthereum, 3000); // 3 seconds
                }
              }}>
              Connect
            </Button>
          ) : (
            <div>{props.address}</div>
          )}
        </div>
      </nav>
    </>
  );
}
export default Navbar;
