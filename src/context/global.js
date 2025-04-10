'use client'

import {getUser} from '@/request/user';
import {checkWalletConnection, connectWallet} from '@/util/connectWallet';
import {Layout, App} from 'antd';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket from '@/util/websocket';
import UserForm from '@/components/UserFrom';
import { getOkbPrice } from '@/request/token';

const GlobalContext = createContext();

const GlobalProvider = ({ serverValue, children }) => {
  const {message, modal} = App.useApp();
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const { onSocket, offSocket, sendMessage, initSocket } = useWebSocket();

  const [okbPrice, setOkbPrice] = useState(null);

  const priceTimer = useRef(null);

  const logoPrefix = useMemo(() => {
    const {urlInfo} = serverValue;
    const { superbase, imageBucket, tokenLogo, filePrefix } = urlInfo;
    return `${superbase}${filePrefix}/${imageBucket}${tokenLogo}`;
  }, [serverValue]);

  const fetchUser = useCallback(async (address) => {
    const res = await getUser(address);
    setUser(res);
    res && initSocket(`${serverValue.urlInfo.socketHost}/chain?userId=${res.userId}`);
    return res;
  }, []);

  const fetchOkbPrice = useCallback(async () => {
    try {
      const res = await getOkbPrice();
      if (res) {
        setOkbPrice(res);
      }
      priceTimer.current = setTimeout(fetchOkbPrice, 10 * 1000);
    } catch {
      // do nothing
    }
  }, []);

  const checkUser = useCallback(async (forceConnect = false) => {
    const accounts = await checkWalletConnection();
    if (accounts) {
      setAddress(accounts[0]);
      const res = await fetchUser(accounts[0]);
      if (!res) {
        if (forceConnect) {
          setShowUserForm(true);
        }
        return { result: false, address: accounts[0] };
      }
      return { result: true, user: res };
    }
    if (forceConnect) {
      const accounts = await connectWallet();
      if (accounts) {
        setAddress(accounts[0]);
        const res = await getUser(accounts[0]);
        if (!res) {
          setShowUserForm(true);
          return { result: false, address: accounts[0] };
        }
        return { result: true, user: res };
      }
    }
    return { result: false };
  }, [fetchUser]);

  const providerValue = useMemo(() => 
    ({
      user, setUser,
      address, setAddress,
      message, modal,
      logoPrefix,
      okbPrice,
      checkUser, showUserForm, setShowUserForm,
      onSocket, offSocket, sendMessage
    }), [user, address, message, modal, logoPrefix, okbPrice, checkUser, showUserForm, onSocket, offSocket, sendMessage]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        fetchUser(accounts[0]);
      });
    }
    checkUser();
    return () => {
      if (window.ethereum) {
        window.ethereum.off('accountsChanged');
      }
    }
  }, []);

  useEffect(() => {
    fetchOkbPrice();
    return () => {
      if (priceTimer.current) {
        clearTimeout(priceTimer.current);
      }
    }
  }, []);

  return (
    <GlobalContext.Provider value={providerValue}>
      <Layout id='root' className='h-full overflow-y-auto'>
        {children}
        <UserForm />
      </Layout>
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
