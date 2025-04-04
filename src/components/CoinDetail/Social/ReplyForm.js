import { PlusOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { Input, Modal, Form, Button, Upload } from 'antd';
import { useEffect, useState } from 'react';

const ReplyFormModal = ({ visible, onClose, onOk }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const {message} = App.useApp();

  const confirmModal = async () => {
    try {
      setLoading(true);
      const res = await form.validateFields();
      console.log(res);
      if (onOk) {
        await onOk(res);
        message.success('Comment added successfully!');
        onClose();
      }
    } catch {
      // do something
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [form, visible]);


  return (
    <Modal
      open={visible}
      maskClosable={false}
      onCancel={onClose}
      title='Add a Comment'
      onOk={confirmModal}
      okButtonProps={{
        loading
      }}
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          label='Comment'
          name='text'
          rules={[{ required: true, message: 'Please input your comment!' }]}
        >
          <Input.TextArea
            autoSize={{
              minRows: 6,
              maxRows: 6
            }}
          />
        </Form.Item>
        <Form.Item
          label="Image(optional)"
          name="image"
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
      </Form>
    </Modal>
  )
}

export default ReplyFormModal;
