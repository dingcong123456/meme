'use client'
import { Tabs } from 'antd';
import { useState } from 'react';
import TradingList from './TradingList';
import ReplyList from './Reply';

const tabItems = [
  {
    label: 'thread',
    key: 'thread'
  },
  {
    label: 'trades',
    key: 'trades'
  }
];

const CoinDetailSocialTab = ({record}) => {
  const [activeTab, setActiveTab] = useState('thread');

  const {address} = record || {};

  const generateMainContent = () => {
    if (activeTab === 'trades') {
      return (
        <TradingList tokenAddress={address} />
      );
    }
    if (activeTab === 'thread') {
      return (
        <ReplyList record={record} />
      );
    }
    return null;
  };


  return (
    <div>
      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
      <div>
        {generateMainContent()}
      </div>
    </div>
  )
}

export default CoinDetailSocialTab;
