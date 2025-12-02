// logApi usage moved into useSysOpLogs hook
import { OpLog } from '@/services/types';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Tag } from 'antd';
import { useRef, useEffect } from 'react';
import { useSysOpLogs } from '@/hooks/useSysOpLogs';

const SysOpLogManagement = () => {
  const actionRef = useRef();
  const { list, total, loading, fetchList } = useSysOpLogs();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const renderStatus = (status: number) => (
    <Tag color={status === 200 ? 'green' : 'red'}>
      {status === 200 ? '成功' : '失败'}
    </Tag>
  );

  const columns: ProColumns<OpLog>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '模块', dataIndex: 'module', key: 'module' },
    { title: '操作', dataIndex: 'name', key: 'name' },
    { title: '请求路径', dataIndex: 'path', key: 'path' },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      hideInSearch: true,
    },
    { title: '请求IP', dataIndex: 'ip', key: 'ip' },
    {
      title: '状态',
      dataIndex: 'code',
      key: 'code',
      hideInSearch: true,
      render: (__, { status }) => renderStatus(status),
    },
    { title: '消息', dataIndex: 'message', key: 'message', hideInSearch: true },
    {
      title: '请求Id',
      dataIndex: 'request_id',
      key: 'request_id',
      hideInSearch: true,
    },
    {
      title: '请求参数',
      dataIndex: 'params',
      key: 'params',
      hideInSearch: true,
    },
    {
      title: '请求耗时(毫秒)',
      dataIndex: 'duration',
      key: 'duration',
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

export default SysOpLogManagement;
