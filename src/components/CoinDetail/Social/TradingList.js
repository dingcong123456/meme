'use client';
import { getTransactions } from '@/request/token';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tooltip } from 'antd';
import { formatNumberWithSuffix, parseBitInt } from '@/util';
import Link from 'next/link';

dayjs.extend(relativeTime)

const TradingList = ({ tokenAddress }) => {
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [pageNo, setPageNo] = useState(1);

  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: 'Account',
      dataIndex: 'userId',
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return (
          <Link
            href={`/profile/${record?.address}`}
          >
            {text}
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (text) => text === 0 ? 'sell' : 'buy',
      width: 80
    },
    {
      title: 'OKB',
      dataIndex: 'amount',
      render: (text) => {
        if (!text) {
          return '';
        }
        const {display, value} = parseBitInt(text);
        return (
          <Tooltip
            title={value}
          >
            <span>
              {
                display
              }
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: 'coins',
      dataIndex: 'tokenAmount',
      render: (text) => {
        if (!text) {
          return '';
        }
        const {display, value} = parseBitInt(text);
        return (
          <Tooltip
            title={value}
          >
            <span>
              {
                display
              }
            </span>
          </Tooltip>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      width: 130,
      render: (text) => text ? dayjs(text).fromNow() : ''
    },
    {
      title: 'transaction',
      dataIndex: 'hash',
      ellipsis: true,
      width: 140
    }
  ];

  const fetchDataSource = async (address, current) => {
    try {
      setLoading(true);
      const res = await getTransactions({ pageNo: current, address: address });
      console.log(res);
      setDataSource(res?.data || []);
      setTotal(res?.total || 0);
    } catch {
      // do nothing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchDataSource(tokenAddress, pageNo);
    }
  }, [tokenAddress, pageNo]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        size='small'
        rowKey='id'
        loading={loading}
        pagination={{
          current: pageNo,
          total,
          onChange: (page) => {
            setPageNo(page);
          }
        }}
      />
    </div>
  )
}

export default TradingList;
