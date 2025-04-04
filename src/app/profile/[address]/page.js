'use client'
import CreateCoinList from '@/components/Profile/CreateCoinList';
import { GlobalContext } from '@/context/global';
import { getUser } from '@/request/user';
import { EditOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Spin } from 'antd';
import { Avatar, Button, Typography } from 'antd';
import { use, useContext, useEffect, useMemo, useState } from 'react';

const { Paragraph } = Typography;

const tabItems = [
  {
    key: 'create-coins',
    label: 'Coins Created'
  }
];

const UserProfilePage = ({ params }) => {
  const { address } = use(params);
  const { user, setShowUserForm, logoPrefix } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const [activeTab, setActiveTab] = useState('create-coins');

  const isOwner = useMemo(() => {
    return user?.address === address;
  }, [user, address]);

  const fetchUserDetail = async (userAddress) => {
    try {
      setLoading(true);
      const res = await getUser(userAddress);
      console.log(11, res);
      setUserInfo(res);
    } catch {
      // do something
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserDetail(address);
    }
  }, [address]);

  const generateMainContent = () => {
    if (activeTab === 'create-coins') {
      return (
        <CreateCoinList
          address={userInfo?.address}
          logoPrefix={logoPrefix}
        />
      );
    }
  };

  return (
    <div className='flex-1 flex flex-col gap-4'>
      <Spin
        spinning={loading}
      >
        <div
          className='flex flex-col justify-center items-center gap-2 text-white px-3'
        >
          <div className='flex justify-between w-full md:w-[390px] mb-2'>
            <div className='flex items-center gap-3'>
              <Avatar
                size={64}
                src='/avatar.png'
              />
              <div className='flex flex-col gap-2'>
                <span>
                  @{userInfo?.userId}
                </span>
                <div>
                  <span className='mr-2'>
                    {userInfo?.username}
                  </span>
                  {
                    isOwner ? (
                      <Button
                        icon={<EditOutlined />}
                        size='small'
                        onClick={() => setShowUserForm(true)}
                      >
                        edit profile
                      </Button>
                    ) : null
                  }

                </div>
              </div>
            </div>
            <div></div>
          </div>
          {
            userInfo?.address ? (
              <div
                className='border border-gray-200 flex items-center p-2 rounded-md'
              >
                <Paragraph
                  copyable={{ text: userInfo?.address }}
                  className='!mb-0 text-white'
                >
                  {userInfo?.address}
                </Paragraph>
              </div>
            ) : null
          }
        </div>
      </Spin>
      <div className='flex-1 flex flex-col px-3 md:px-0'>
        <Tabs
          items={tabItems}
        />
        <div className='flex-1 flex'>
          {
            generateMainContent()
          }
        </div>
      </div>
    </div>
  )
};

export default UserProfilePage;
