// paymentApi moved into usePayments hook
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { history } from '@umijs/max';
import { Button, message, Switch } from 'antd';
import { useRef, useEffect, useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentMethod } from '@/services/types';

const PaymentMethodManagement = () => {
  const actionRef = useRef();
  const [, setConfigModalVisible] = useState(false);
  const [, setCurrentPaymentMethod] = useState<PaymentMethod>();
  const { list, total, loading, fetchList, updateStatus } = usePayments();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const handleStatusChange = async (record: any) => {
    const newStatus = record.status === 1 ? 2 : 1; // 1: 启用, 2: 禁用
    try {
      const res = await updateStatus({ uuid: record.uuid, status: newStatus });
      if (res?.code === 200) {
        message.success('状态更新成功');
      } else {
        message.error('状态更新失败: ' + res?.message);
      }
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleEditConfig = (record: PaymentMethod) => {
    if (record.code === 'paypal') {
      history.push('/system/pay/edit');
      return;
    }

    if (record.code === 'alipay') {
      history.push('/system/pay/alipay/edit');
      return;
    }

    setCurrentPaymentMethod(record);
    setConfigModalVisible(true);
  };

  const columns: ProColumns<PaymentMethod>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      hideInSearch: true,
      render: (__, { icon }) => (
        <img src={icon} alt="icon" style={{ width: 40, height: 40 }} />
      ),
    },
    { title: '支付方式名称', dataIndex: 'name', key: 'name' },
    { title: '支付方式代码', dataIndex: 'code', key: 'code' },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record.status === 1}
          onChange={() => handleStatusChange(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Button
            icon={<SettingOutlined />}
            onClick={() => handleEditConfig(record)}
            style={{ marginRight: 8 }}
          >
            配置
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditConfig(record)}
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
        </span>
      ),
    },
  ];

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
        options={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => []}
      />
    </PageContainer>
  );
};

export default PaymentMethodManagement;
