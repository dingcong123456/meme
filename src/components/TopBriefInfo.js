'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useMemo } from 'react';
import { GlobalContext } from '@/context/global';

dayjs.extend(relativeTime)

const TopBriefInfo = ({ record, tokenCount }) => {
  const { okbPrice } = useContext(GlobalContext);

  const { name, ticker, user } = record || {};

  const marketCap = useMemo(() => {
    if (okbPrice && record?.marketCap) {
      const totalCap = record.marketCap * okbPrice;
      console.log(totalCap);
      // suffix k, m, b
      if (totalCap < 1000) {
        return `$${totalCap.toFixed(2)}`;
      }
      if (totalCap < 1000000) {
        return `$${(totalCap / 1000).toFixed(2)}k`;
      }
      if (totalCap < 1000000000) {
        return `$${(totalCap / 1000000).toFixed(2)}m`;
      }
    }
  }, [record, okbPrice]);

  return (
    <div className='flex w-full flex-wrap gap-4 md:w-auto'>
      <div className='flex-shrink-0 text-sm font-medium text-[#F8FAFC]'>
        <span>
          {name}
        </span>
        <span>
          ({ticker})
        </span>
      </div>
      <div className='inline-flex flex-shrink-0 items-center gap-4 text-[#9DC4F8]'>
        <Link
          href={`/profile/${user?.address}`}
        >
          <span>
            <span className='flex gap-1 rounded px-1 hover:underline text-black bg-[#d5d5f7]'>
              {user?.username}
            </span>
          </span>
        </Link>
        <span>
          about {record?.createTime ? dayjs(record.createTime).fromNow() : ''}
        </span>
      </div>
      <div className='flex flex-wrap items-center gap-2 text-green-300'>
        <span>
          market cap: {marketCap}
        </span>
      </div>
      <div className='flex flex-shrink-0 items-center gap-1 text-[#9DA3AE]'>
        <span>
          replies: {tokenCount || 0}
        </span>
      </div>
    </div>
  )
}

export default TopBriefInfo;
