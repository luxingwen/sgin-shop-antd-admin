// apiApi usage moved into useApis hook
import { Api } from '@/services/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Tag,
} from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useApis } from '@/hooks/useApis';

const { Option } = Select;

const SysApiInfoManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApiInfo, setEditingApiInfo] = useState<Api>();
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const { list, total, loading, fetchList, remove, add, update } = useApis();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const handleAddApiInfo = () => {
    setEditingApiInfo(undefined);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditApiInfo = (record: Api) => {
    setEditingApiInfo(record);
    form.setFieldsValue({
      ...record,
      status: record.status === 1,
    });
    setIsModalVisible(true);
  };

  const handleDeleteApiInfo = async (id: string) => {
    try {
      await remove(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.status = values.status ? 1 : 0; // Converting switch boolean to status integer
      if (editingApiInfo) {
        await update({ ...editingApiInfo, ...values });
        message.success('更新成功');
      } else {
        await add(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderStatus = (status: number) => (
    <Tag color={status === 1 ? 'green' : 'red'}>
      {status === 1 ? '启用' : '禁用'}
    </Tag>
  );

  const renderPermissionLevel = (level: number) => {
    const levelMap = new Map([
      [1, '公开'],
      [2, '登录用户'],
      [3, '管理员'],
      [4, '超级管理员'],
      [5, '自定义'],
      [6, '不可调用'],
      [7, '内部调用'],
      [8, '第三方调用'],
      [9, '其他'],
      [10, '未知'],
    ]);
    return levelMap.get(level) || '未知';
  };

  const columns: ProColumns<Api>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: '模块', dataIndex: 'module', key: 'module' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '路径', dataIndex: 'path', key: 'path' },
    { title: '方法', dataIndex: 'method', key: 'method' },
    {
      title: '权限等级',
      dataIndex: 'permission_level',
      key: 'permission_level',
      render: (__, { permission_level }) =>
        renderPermissionLevel(permission_level),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      render: (__, { status }) => renderStatus(status),
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditApiInfo(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => handleDeleteApiInfo(record.uuid)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  // 使用 hook fetchList 提供受控数据

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        dataSource={list}
        loading={loading}
        pagination={{
          total,
          showSizeChanger: true,
        }}
        onChange={(pagination) => fetchList({ page: pagination.current, pageSize: pagination.pageSize })}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 'max-content' }}
        options={false}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleAddApiInfo}
            type="primary"
          >
            添加API信息
          </Button>,
        ]}
      />
      <Modal
        title={editingApiInfo ? '编辑API信息' : '添加API信息'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="module"
            label="模块"
            rules={[{ required: true, message: '请输入模块名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="method"
            label="方法"
            rules={[{ required: true, message: '请输入方法' }]}
          >
            <Select>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="permission_level"
            label="权限等级"
            rules={[{ required: true, message: '请选择权限等级' }]}
          >
            <Select>
              <Option value={1}>公开</Option>
              <Option value={2}>登录用户</Option>
              <Option value={3}>管理员</Option>
              <Option value={4}>超级管理员</Option>
              <Option value={5}>自定义</Option>
              <Option value={6}>不可调用</Option>
              <Option value={7}>内部调用</Option>
              <Option value={8}>第三方调用</Option>
              <Option value={9}>其他</Option>
              <Option value={10}>未知</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default SysApiInfoManagement;
