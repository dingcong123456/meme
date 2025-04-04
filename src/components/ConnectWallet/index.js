'use client'
import { useContext, useState } from 'react';
import { GlobalContext } from '@/context/global';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useRouter } from 'next/navigation';

const ConnectWallet = () => {
  const { user, setShowUserForm, checkUser } = useContext(GlobalContext);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  // const [account, setAccount] = useState(null);
  // const [showModal, setShowModal] = useState(false); // 新增状态管理弹窗显示

  const connect = async () => {
    try {
      setLoading(true);
      const res = await checkUser(true);
      if (res?.result) {
        window.location.reload();
      }
    } catch {
      // do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center m-4'>
      {!user && (
        <Button
          onClick={connect}
          loading={loading}
        >
          Connect Wallet
        </Button>
      )}
      {!!user && (
        <Tooltip
          title='click to view user profile'
        >
          <Button
            type='text'
            onClick={() => {
              router.push(`/profile/${user?.address}`);
            }}
            icon={<UserOutlined />}
          >
            {user.username}
          </Button>
        </Tooltip>
      )}
    </div>
  )
}

export default ConnectWallet;