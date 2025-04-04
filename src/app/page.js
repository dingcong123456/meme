'use client'
import HomeSearch from '@/components/HomeSearch';
import PageLoading from '@/components/Loading';
import { GlobalContext } from '@/context/global';
import { getTokenList } from '@/request/token';
import { Select, Pagination } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useMemo, useState } from 'react';

dayjs.extend(relativeTime)

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [total, setTotal] = useState(0);

  const [pageNo, setPageNo] = useState(1);

  const [keyword, setKeyword] = useState('');

  const { logoPrefix, okbPrice } = useContext(GlobalContext);

  const fetchList = async ({ page, keyword }) => {
    try {
      setLoading(true);
      const res = await getTokenList({ pageNo: page, keyword: encodeURIComponent(keyword) });
      console.log(res);
      setDataSource(res?.data || []);
      setTotal(res?.total || 0);
    } catch {
      // do something
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList({ page: pageNo, keyword });
  }, [pageNo, keyword]);

  const generateMainContent = () => {
    if (!dataSource.length) {
      return (
        <div className='text-center text-gray-400 py-4'>
          No data
        </div>
      );
    }
    return (
      <div
        className='grid-col-1 grid text-gray-400 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-0 lgplus:gap-4 py-2 gap-4'
      >
        {
          dataSource.map((item) => {
            return (
              <SingleCoinCard
                key={item.tokenId}
                record={item}
                logoPrefix={logoPrefix}
                okbPrice={okbPrice}
              />
            );
          })
        }
      </div>
    );
  };

  return (
    <div className='flex-1 flex flex-col gap-4 px-4'>
      <div>
        <div className='py-6 text-center'>
          <Link
            href='/create'
            className='text-2xl text-white'
          >
            Start a new Coin
          </Link>
        </div>
      </div>
      <div className='flex-1 relative'>
        <HomeSearch
          value={keyword}
          onChange={setKeyword}
        />
        <div className='py-4 flex flex-col gap-4'>
          {/* <SortArea /> */}
          {generateMainContent()}
          {
            total > 0 ? (
              <Pagination
                total={total}
                current={pageNo}
                className='justify-center'
                showSizeChanger={false}
                onChange={(page) => {
                  setPageNo(page);
                }}
              />
            ) : null
          }
        </div>
        <PageLoading loading={loading} />
      </div>
    </div>
  );
}

const SortArea = ({ value }) => {
  const [selectedValue, setSelectedValue] = useState(value || 'lastTrade');

  const items = [
    {
      label: 'sort: last trade',
      value: 'lastTrade'
    },
    {
      label: 'sort: creation time',
      value: 'creationTime'
    },
    {
      label: 'sort: last replay',
      value: 'lastReplay'
    }
  ];
  return (
    <Select
      options={items}
      style={{
        width: 200
      }}
      value={selectedValue}
      onChange={setSelectedValue}
      size='large'
    />
  );
};

export const SingleCoinCard = ({ record, logoPrefix, okbPrice }) => {
  const router = useRouter();

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
      if (totalCap < 1000000) {
        return `$${(totalCap / 1000000).toFixed(2)}b`;
      }
      
    }
  }, [record, okbPrice]);

  return (
    <Link
      href={`/coin/${record.tokenId}`}
      className='text-gray-400'
    >
      <div
        className='border border-transparent hover:border-white flex gap-2 max-h-[300px] overflow-hidden p-2'
      >
        <div className='relative min-w-32 self-start'>
          <Image
            src={`${logoPrefix}/${record.ticker}`}
            alt='coin image'
            className='h-auto w-32'
            width={128}
            height={128}
          />
        </div>
        <div className='flex-1 flex flex-col gap-1 overflow-hidden'>
          <div className='flex flex-wrap items-center gap-2 text-xs text-blue-200'>
            <span>
              created by
            </span>
            <span
              className='text-blue-200 hover:text-blue-400'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/profile/${record?.user?.address}`);
              }}
            >
              {record?.user?.username}
            </span>
            <span>
              {record?.createTime ? dayjs(record.createTime).fromNow() : ''}
            </span>
          </div>
          <div className='flex gap-1 overflow-hidden text-xs text-green-300'>
            <span>
              market cap:
            </span>
            <span>
              {marketCap}
            </span>
          </div>
          <div className='flex items-center gap-2 text-xs'>
            <span>
              replies:
            </span>
            <span>
              123
            </span>
          </div>
          <div className='w-full break-words text-sm overflow-hidden'>
            <span className='break-words'>
              <span className='mr-1 font-bold'>
                {record?.name || ''}({record?.ticker || ''}):
              </span>
              {record?.description || ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
