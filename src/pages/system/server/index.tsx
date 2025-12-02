import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useServers from '@/hooks/useServers';

const ServerManagement = () => {
  const actionRef = useRef();
  const { list, total, loading, fetchList, create, update, remove } = useServers();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any>();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const handleAdd = () => {
    setEditing(undefined);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (record: any) => {
    const res = await remove({ uuid: record.uuid });
    if (res?.code === 200) {
      message.success('删除成功');
      fetchList({ page: 1, pageSize: 10 });
    } else {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        const res = await update({ ...editing, ...values });
        if (res?.code === 200) {
          message.success('更新成功');
          setVisible(false);
          fetchList({ page: 1, pageSize: 10 });
        } else {
          message.error('更新失败');
        }
      } else {
        const res = await create(values);
        if (res?.code === 200) {
          message.success('创建成功');
          setVisible(false);
          fetchList({ page: 1, pageSize: 10 });
        } else {
          message.error('创建失败');
        }
      }
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns: any = [
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'host', key: 'host' },
    { title: '端口', dataIndex: 'port', key: 'port' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }} />
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record)} okText="是" cancelText="否">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="uuid"
        actionRef={actionRef}
        dataSource={list}
        loading={loading}
        pagination={{ total, showSizeChanger: true }}
        search={{ labelWidth: 'auto' }}
        options={false}
        toolBarRender={() => [
          <Button key="add" icon={<PlusOutlined />} type="primary" onClick={handleAdd}>添加</Button>,
        ]}
      />

      <Modal title={editing ? '编辑服务' : '添加服务'} open={visible} onOk={handleOk} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="host" label="Host" rules={[{ required: true, message: '请输入host' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="port" label="Port" rules={[{ required: true, message: '请输入端口' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ServerManagement;
