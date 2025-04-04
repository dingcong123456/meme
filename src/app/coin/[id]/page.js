import TopBriefInfo from '@/components/TopBriefInfo';
import TradingChart from '@/components/CoinDetail/TradingChart';
import TransactionCard from '@/components/CoinDetail/TransactionCard';
import { findToken } from '@/services/token';
import Link from 'next/link';
import CoinDetailSocialTab from '@/components/CoinDetail/Social';
import { getCommentsCount } from '@/services/comment';

const CoinDetailPage = async ({ params }) => {
  const { id } = await params;
  let token = null;

  token = await findToken(id);
  console.log(token);

  const tokenCount = await getCommentsCount(id);

  return (
    <div
      className='flex-1 flex flex-col p-4 gap-2'
    >
      <div>
        <Link
          href='/'
          className='text-white hover:font-bold'
        >
          [ go back ]
        </Link>
      </div>
      <div className='flex gap-4 flex-col md:flex-row'>
        <div className='md:w-2/3 w-full space-y-2'>
          <TopBriefInfo
            record={token}
            tokenCount={tokenCount}
          />
          <div className=''>
            <TradingChart tokenAddress={token?.address} />
          </div>
          <CoinDetailSocialTab
            record={token}
          />
        </div>
        <div className='w-fit mx-auto'>
          <TransactionCard
            record={token}
          />
        </div>
      </div>
    </div>
  )
}

export default CoinDetailPage;
