'use client'

import React, { useContext, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import {addUser, modifyUser} from '@/request/user';
import {GlobalContext} from '@/context/global';

const UserForm = () => {
  const { message, user, setUser, showUserForm, setShowUserForm, address  } = useContext(GlobalContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      open={showUserForm}
      title={user?.userId ? 'Edit' : 'Create'}
      okText='Save'
      cancelText='Cancel'
      onCancel={() => setShowUserForm(false)}
      okButtonProps={{ loading }}
      onOk={async () => {
        setLoading(true);
        try {
          const values = await form.validateFields();
          let u;
          if (user?.userId) {
            u = await modifyUser(user.userId, values);
          } else {
            u = await addUser({...values, address});
          }
          setUser(u);
          message.success('Save success');
          setLoading(false);
          setShowUserForm(false);
        } catch(e) {
          message.error('Save failed');
          setLoading(false);
          setShowUserForm(false);
        }
      }}
    >
      <Form
        form={form}
        layout='horizontal'
        labelCol={{ span: 4 }}
        initialValues={user}
      >
        <Form.Item
          name='username'
          label='Name'
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='bio'
          label='Bio'
          rules={[{ required: false, message: 'Please input bio!' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
