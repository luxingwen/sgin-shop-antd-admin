import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import { useEffect } from 'react';
import useReturns from '@/hooks/useReturns';

const ReturnManagement = () => {
  const { list, loading, fetchList, approve, reject } = useReturns();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleApprove = async (record: any) => {
    const input = window.prompt('请输入退款金额', String(record.amount || '0'));
    if (input == null) return;
    const v = parseFloat(input);
    if (isNaN(v)) {
      message.error('退款金额格式不正确');
      return;
    }
    const res = await approve({ uuid: record.uuid, refund_amount: v });
    if (res?.code === 200) {
      message.success('审批通过');
      fetchList();
    } else {
      message.error('审批失败');
    }
  };

  const handleReject = async (record: any) => {
    const reason = window.prompt('请输入拒绝原因', '不符合退货政策');
    if (reason == null) return;
    const res = await reject({ uuid: record.uuid, reason });
    if (res?.code === 200) {
      message.success('已拒绝');
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const columns: any = [
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
    { title: '申请人', dataIndex: 'user_id', key: 'user_id' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { title: '原因', dataIndex: 'reason', key: 'reason', hideInSearch: true },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_: any, record: any) => (
        <span>
          <Popconfirm title="确认通过？" onConfirm={() => handleApprove(record)} okText="是" cancelText="否">
            <Button type="primary" icon={<CheckOutlined />} style={{ marginRight: 8 }}>
              通过
            </Button>
          </Popconfirm>
          <Popconfirm title="确认拒绝？" onConfirm={() => handleReject(record)} okText="是" cancelText="否">
            <Button danger icon={<CloseOutlined />}>拒绝</Button>
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
        dataSource={list}
        loading={loading}
        pagination={false}
        search={false}
        options={false}
      />
    </PageContainer>
  );
};

export default ReturnManagement;
