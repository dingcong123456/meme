import { getCommentList } from '@/request/token';
import { List } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ReplyItemList = ({ tokenId }) => {
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = useState(1);

  const [total, setTotal] = useState(0);

  const pageSize = 10;

  const fetchDataSource = async (tokenId, page = 1) => {
    try {
      setLoading(true);
      const res = await getCommentList(tokenId, { take: pageSize, skip: (page - 1) * pageSize });
      console.log(res);
      setDataSource((prev) => [...prev, ...(res?.data || [])]);
      setTotal(res?.total || 0);
    } catch {
      // do nothing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenId && pageNo) {
      fetchDataSource(tokenId, pageNo);
    }
  }, [tokenId, pageNo]);

  return (
    <div>
      <List
        dataSource={dataSource}
        loading={loading}
        pagination={{
          pageSize: pageSize,
          total,
          current: pageNo,
          size: 'small',
          onChange: (page) => {
            setPageNo(page);
          }
        }}
        renderItem={(item) => {
          return (
            <List.Item key={item.commentId}>
              <SingleReplyCard record={item} />
            </List.Item>
          );
        }}
      >
      </List>
    </div>
  )
}

const SingleReplyCard = ({ record }) => {
  const { image, user, createTime } = record || {};

  return (
    <div
      className='text-slate-300 bg-[#2e303a] p-1 text-sm flex flex-col gap-2 flex-1'
    >
      <div className='flex items-center gap-2'>
        <img
          src='/avatar.png'
          alt='avatar'
          className='h-4 w-4 rounded-full'
        />
        <span>
          {user?.username}
        </span>
        <span>
          {createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
      </div>
      <div className='flex gap-2'>
        {
          image ? (
            <div className='relative min-w-32 self-start'>
              <Image
                src={`https://oyelpqtftxnngxvobptl.supabase.co/storage/v1/object/public/${image}`}
                alt='coin image'
                className='h-auto w-32'
                width={128}
                height={128}
              />
            </div>
          ) : null
        }
        <div className='flex-1'>
          <div>
            {record?.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItemList