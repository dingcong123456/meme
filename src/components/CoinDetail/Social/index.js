'use client'
import { Tabs } from 'antd';
import { useState } from 'react';
import TradingList from './TradingList';
import ReplyList from './Reply';
import './social.css'

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
      <div className="social-tabs">
        <div onClick={() => setActiveTab('thread')} className={`social-tab ${activeTab === 'thread' ? 'active' : ''}`}>thread</div>
        <div onClick={() => setActiveTab('trades')} className={`social-tab ${activeTab === 'trades' ? 'active' : ''}`}>trades</div>
      </div>
      <div>
        {generateMainContent()}
      </div>
    </div>
  )
}

export default CoinDetailSocialTab;
