'use client'
import { login } from '@/request/user';
import { Button, Form, Input, Layout, App } from 'antd'
import { useState } from 'react';

const LoginPage = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  const confirmForm = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const res = await login(values);
      if (res?.token) {
        localStorage.setItem('token', res.token);
        message.success('Login successful');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      className='w-full h-full flex items-center justify-center text-white'
    >
      <div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>
        </div>
      </div>
      <div className='py-8'>
        <Form
          form={form}
          layout='vertical'
          requiredMark={false}
          style={{
            width: '300px'
          }}
          size='large'
        >
          <Form.Item
            label='Account'
            name='account'
            rules={[{ required: true, message: 'Please input your account!' }]}
          >
            <Input placeholder='Please enter your account' />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder='Please enter your password' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              block
              onClick={confirmForm}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  )
}

export default LoginPage;