import { DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import useReconcile from '@/hooks/useReconcile';

const PaymentReconcile = () => {
  const { list, loading, fetchUnmatched, run, exportUnmatched, manualMark } = useReconcile();
  const [visibleExport, setVisibleExport] = useState(false);

  useEffect(() => {
    fetchUnmatched();
  }, [fetchUnmatched]);

  const handleRun = async () => {
    const res = await run({});
    if (res?.code === 200) {
      message.success('对账任务已触发');
      fetchUnmatched();
    } else {
      message.error('触发对账失败');
    }
  };

  const handleExport = async () => {
    try {
      const resp = await exportUnmatched();
      const blob = resp instanceof Blob ? resp : new Blob([resp]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `unmatched_payments.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setVisibleExport(true);
    } catch (err) {
      message.error('导出失败');
    }
  };

  const handleMark = async (record: any) => {
    const res = await manualMark({ uuid: record.uuid });
    if (res?.code === 200) {
      message.success('标记成功');
      fetchUnmatched();
    } else {
      message.error('标记失败');
    }
  };

  const columns: any = [
    { title: '交易 UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: '订单 ID', dataIndex: 'order_id', key: 'order_id' },
    { title: '支付金额', dataIndex: 'amount', key: 'amount' },
    { title: '支付时间', dataIndex: 'paid_at', key: 'paid_at' },
    { title: '渠道', dataIndex: 'payment_method', key: 'payment_method' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleMark(record)}>
          标记为已匹配
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button icon={<PlayCircleOutlined />} type="primary" onClick={handleRun} loading={loading}>
          运行对账
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出未匹配
        </Button>
      </div>
      <ProTable
        columns={columns}
        rowKey="uuid"
        dataSource={list}
        loading={loading}
        pagination={false}
        search={false}
        options={false}
      />

      <Modal
        title="导出已触发"
        open={visibleExport}
        footer={null}
        onCancel={() => setVisibleExport(false)}
      >
        导出完成，请在浏览器下载区域查看。
      </Modal>
    </PageContainer>
  );
};

export default PaymentReconcile;

