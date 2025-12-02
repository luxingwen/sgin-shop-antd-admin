import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Popconfirm, Modal, Form, Input, Switch } from 'antd';
import ProTable from '@ant-design/pro-table';
// teamService moved into useTeams hook
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useTeams } from '@/hooks/useTeams';

const TeamManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [form] = Form.useForm();
  const actionRef = useRef();

  const { list, total, loading, fetchList, remove, add, update } = useTeams();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const handleAddTeam = () => {
    setEditingTeam(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTeam = (record) => {
    setEditingTeam(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteTeam = async (id) => {
    try {
      await remove(id);
      message.success('删除成功');
      fetchList({ page: 1, pageSize: 10 });
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTeam) {
        await update({ ...editingTeam, ...values });
        message.success('更新成功');
      } else {
        await add(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      fetchList({ page: 1, pageSize: 10 });
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleMemberManagement = (record) => {
   history.push(`/system/team/member/${record.uuid}`);
  };

  const handleRoleManagement = (record) => {
    history.push(`/system/team/role/${record.uuid}`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid', width: 300 },
    { title: '团队名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'desc', key: 'desc' },
    {
      title: '是否活跃',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (isActive ? '是' : '否'),
    },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at', hideInSearch: true },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTeam(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="确定删除这个团队吗?"
            onConfirm={() => handleDeleteTeam(record.uuid)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
          <Button onClick={()=> handleMemberManagement(record)} >成员管理</Button>
          <Button onClick={()=> handleRoleManagement(record)} >角色管理</Button>
        </span>
      ),
    },
  ];

  // 使用 useTeams 提供的受控数据（list/total/loading）

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="uuid"
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
        options={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleAddTeam}
            type="primary"
          >
            创建团队
          </Button>,
        ]}
      />
      <Modal
        title={editingTeam ? '编辑团队' : '创建团队'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="团队名称"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="是否活跃"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TeamManagement;
