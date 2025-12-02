import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Popconfirm, Modal, Form, Select } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useUsers } from '@/hooks/useUsers';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
import { useTeamMembers } from '@/hooks/useTeamMembers';

const { Option } = Select;

const TeamMemberManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const actionRef = useRef();
  const {teamId} = useParams();
  const { list, total, loading, fetchList, remove, add } = useTeamMembers();
  const { getOptions } = useUsers();

  useEffect(() => {
    (async () => {
      try {
        const opts = await getOptions();
        setUsers(opts || []);
      } catch (e) {
        message.error('获取用户列表失败');
      }
    })();
    fetchList({ page: 1, pageSize: 10, team_uuid: teamId });
  }, [fetchList, teamId, getOptions]);

  const handleAddMember = () => {
    // setSelectedUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDeleteMember = async (id) => {
    try {
      await remove(id);
      message.success('删除成功');
      fetchList({ page: 1, pageSize: 10, team_uuid: teamId });
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.team_uuid = teamId;
      await add(values);
      message.success('添加成功');
      setIsModalVisible(false);
      fetchList({ page: 1, pageSize: 10, team_uuid: teamId });
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid', width: 300 },
    { title: '成员姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Popconfirm
            title="确定删除这个成员吗?"
            onConfirm={() => handleDeleteMember(record.uuid)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  // 使用 useTeamMembers 提供受控数据 list/total/loading

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
        onChange={(pagination) => fetchList({ page: pagination.current, pageSize: pagination.pageSize, team_uuid: teamId })}
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleAddMember}
            type="primary"
          >
            添加成员
          </Button>,
        ]}
      />
      <Modal
        title="添加成员"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="user_uuid"
            label="选择成员"
            rules={[{ required: true, message: '请选择一个用户' }]}
          >
            <Select
              showSearch
              placeholder="选择一个用户"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option.children as any).toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map((user) => (
                <Option key={user.uuid} value={user.uuid}>
                  {user.username} ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TeamMemberManagement;
