import Link from 'next/link';
import ConnectWallet from '../ConnectWallet';

const NavHeader = () => {
  return (
    <div
      className='flex justify-between text-white px-4 py-2 items-center'
    >
      <Link
        className='text-xl font-bold text-white'
        href='/'
      >
        xxx fun
      </Link>
      <ConnectWallet />
    </div>
  )
}

export default NavHeader;
