// logApi usage moved into useSysLoginLogs hook
import { LoginLog } from '@/services/types';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { useRef, useEffect } from 'react';
import { useSysLoginLogs } from '@/hooks/useSysLoginLogs';

// const { Option } = Select;

const SysLoginLogManagement = () => {
  const actionRef = useRef();
  const { list, total, loading, fetchList } = useSysLoginLogs();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const renderStatus = (status: number) => (
    <Tag color={status === 1 ? 'green' : 'red'}>
      {status === 1 ? '成功' : '失败'}
    </Tag>
  );

  const columns: ProColumns<LoginLog>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      render: (__, { status }) => renderStatus(status),
    },
    { title: '消息', dataIndex: 'message', key: 'message', hideInSearch: true },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      hideInSearch: true,
    },
    { title: '操作系统', dataIndex: 'os', key: 'os', hideInSearch: true },
    {
      title: '登录设备',
      dataIndex: 'device',
      key: 'device',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      hideInSearch: true,
    },
  ];

  // 使用 hook 提供的受控数据

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
        toolBarRender={false}
      />
    </PageContainer>
  );
};

export default SysLoginLogManagement;
