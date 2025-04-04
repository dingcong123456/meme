'use client'

import { GlobalContext } from '@/context/global';
import { addToken } from '@/request/token';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Upload, Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTokenByWallet } from '@/util/coin/createTokenByWallet';

const CreateCoin = () => {
  const { user, message, onSocket, checkUser } = useContext(GlobalContext);
  const router = useRouter();
  const [form] = Form.useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [loading, setLoading] = useState(false);

  const createInWallet = async (address, { name, ticker }) => {
    const tokenResult = await createTokenByWallet(address, { name, ticker });
    const { gasUsed, gasPrice, fee, from, to, extraData } = tokenResult;
    const keys = ['hash', 'from', 'to', 'value', 'type', 'status'];
    const tokenObj = keys.reduce((acc, key) => {
      acc[key] = tokenResult[key];
      return acc;
    }, {});
    const obj = {
      tokenInfo: JSON.stringify(tokenObj),
      gasUsed,
      gasPrice,
      fee,
      from: (from || '').toLowerCase(),
      to: (to || '').toLowerCase(),
      ...(extraData || {})
    };
    console.log(obj);
    return obj;
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log(11, values);
      if (!user) {
        const result = await checkUser(true);
        if (!result) {
          return;
        }
      }
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        const val = key === 'image' ? values[key]?.file : values[key];
        if (val) {
          formData.append(key, val);
        }
      });
      formData.append('userId', user.userId);
      const tokenResult = await createInWallet(user.address, values);
      Object.keys(tokenResult).forEach(key => {
        formData.append(key, tokenResult[key]);
      });
      console.log(formData);
      const newToken = await addToken(formData);
      if (newToken) {
        router.push(`/coin/${newToken.tokenId}`);
        message.success('Coin created successfully!');
      } else {
        throw { message: 'Coin creation failed!' };
      }
    } catch (e) {
      console.log(e);
      message.error(e.shortMessage ?? e.message ?? 'Token creation failed!');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    onSocket('message', (data) => {
      console.log('create page receive:', data);
    });
  }, []);

  return (
    <div className='md:w-96 w-full px-6 md:px-0 mx-auto'>
      <h1 className='text-center mb-4 text-2xl'>Create Coin</h1>
      <Form form={form} labelCol={{ span: 6 }} onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the token name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ticker"
          name="ticker"
          rules={[{ required: true, message: 'Please input the token ticker!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: 'Please input the token image!' }]}
        >
          <Upload
            listType="picture-card"
            multiple={false}
            maxCount={1}
            beforeUpload={() => {
              return false;
            }}
          >
            <Button type='text' icon={<PlusOutlined className='text-3xl' />} />
          </Upload>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the token description!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Telegram"
          name="telegram"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Weblink"
          name="weblink"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Twitter"
          name="twitter"
        >
          <Input />
        </Form.Item>
        <Form.Item label={' '} colon={false}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create
          </Button>
        </Form.Item>
      </Form>
      {previewImage && (
        <Image
          alt='Preview'
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default CreateCoin;
