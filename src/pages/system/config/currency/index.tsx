// currencyApi dynamic import inside handlers
import { CurrencyData } from '@/services/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Switch,
  Tag,
} from 'antd';
import { useRef, useState } from 'react';
import { useDispatch } from '@umijs/max';
import useCurrency from '@/hooks/useCurrency';

const CurrencyManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencyData>();
  const [form] = Form.useForm();
  const actionRef = useRef();

  const handleAddCurrency = () => {
    setEditingCurrency(undefined);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCurrency = (record) => {
    setEditingCurrency(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const { deleteCurrency, addCurrency, updateCurrency } = useCurrency();
  const dispatch = useDispatch();

  const handleDeleteCurrency = async (id) => {
    try {
      await deleteCurrency(id);
      message.success('删除成功');
      (actionRef as any).current?.reload?.();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.status = values.status ? 1 : 0;
      if (editingCurrency) {
        await updateCurrency({ ...editingCurrency, ...values } as any);
        message.success('更新成功');
      } else {
        await addCurrency(values as any);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      (actionRef as any).current?.reload?.();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderStatus = (status) => (
    <Tag color={status ? 'green' : 'red'}>{status ? '启用' : '未启用'}</Tag>
  );

  const columns: ProColumns<CurrencyData>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', hideInSearch: true },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '代码', dataIndex: 'code', key: 'code', hideInSearch: true },
    { title: '符号', dataIndex: 'symbol', key: 'symbol', hideInSearch: true },
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
            onClick={() => handleEditCurrency(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => handleDeleteCurrency(record.uuid)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const fetchCurrencies = async (params) => {
    try {
      const res: any = await new Promise((resolve, reject) => {
        dispatch({ type: 'currency/getList', payload: params, callback: (r: any) => (r?.code === 200 ? resolve(r) : reject(r)) });
      });
      return { data: res.data.data, success: true, total: res.data.total };
    } catch (error) {
      return { data: [], success: false, total: 0 };
    }
  };

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        request={fetchCurrencies}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 'max-content' }}
        options={false}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleAddCurrency}
            type="primary"
          >
            添加币种
          </Button>,
        ]}
      />
      <Modal
        title={editingCurrency ? '编辑币种' : '添加币种'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="代码"
            rules={[{ required: true, message: '请输入代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="symbol"
            label="符号"
            rules={[{ required: true, message: '请输入符号' }]}
          >
            <Input />
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

export default CurrencyManagement;
