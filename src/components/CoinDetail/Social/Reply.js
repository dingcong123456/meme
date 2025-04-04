'use client';
import { GlobalContext } from '@/context/global';
import dayjs from 'dayjs';
import Link from 'next/link';
import { use, useContext, useState } from 'react';
import ReplyItemList from './ReplyList';
import { Button } from 'antd';
import ReplyFormModal from './ReplyForm';
import { addComment } from '@/request/token';
import { v4 as uuidv4 } from 'uuid';

const ReplyList = ({ record }) => {
  const { address, name, ticker, user, tokenId } = record || {};

  const [replyModalVisible, setReplyModalVisible] = useState(false);

  const confirmReplyModal = async (data) => {
    const formData = new FormData();
    formData.append('userId', user?.userId);
    formData.append('text', data.text);
    if (data.image?.file) {
      formData.append('image', data.image?.file);
      formData.append('imageName', uuidv4());
    }
    await addComment(tokenId, '', formData);
  };

  return (
    <div className='mb-4'>
      <div className='py-2 mb-4'>
        <Button
          type='primary'
          size='small'
          onClick={() => setReplyModalVisible(true)}
        >
          Post a reply
        </Button>
      </div>
      <CreatedInfoCard record={record} />
      <ReplyItemList tokenId={tokenId} />
      <ReplyFormModal
        visible={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        onOk={confirmReplyModal}
      />
    </div>
  )
};

const CreatedInfoCard = ({ record }) => {
  const { address, name, ticker, user, createTime, image } = record || {};

  const {logoPrefix} = useContext(GlobalContext);

  return (
    <div
      className='text-slate-300 bg-[#2e303a] p-1 text-sm flex flex-col gap-2'
    >
      <div className='flex items-center gap-2'>
        <img
          src='/avatar.png'
          alt='avatar'
          className='h-4 w-4 rounded-full'
        />
        <Link
          href={`/profile/${use?.address}`}
        >
          {user?.username}(dev)
        </Link>
        <span>
          {createTime ? dayjs(createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
      </div>
      <div className='flex gap-2'>
        <div className='relative min-w-32 self-start'>
          <img
            src={`${logoPrefix}/${image}`}
            alt='coin image'
            className='h-auto w-32'
            width={128}
            height={128}
          />
        </div>
        <div className='flex-1'>
          <div>
            <span>
              {name}({ticker})
            </span>
          </div>
          <div>
            {record?.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyList;
