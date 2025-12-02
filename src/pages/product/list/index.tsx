// productServices moved into hook usage
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
// import { history } from '';
import { Product, ProductVariant } from '@/services/types';
import { useNavigate } from '@umijs/max';
import { Button, message, Modal, Popconfirm, Tag, Typography } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';

const ProductManagement = () => {
  let navigate = useNavigate();
  const actionRef = useRef<ActionType>();

  const { list, total, loading, fetchList, remove } = useProducts();

  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleAddProduct = () => {
    navigate('../create');
    // history.push('/product/create');
  };

  // 使用 model 的 fetchList，通过受控 dataSource 提供给 ProTable

  const handleDeleteProduct = async (id: string) => {
    try {
      await remove(id);
      message.success('删除成功');
      fetchList({ page: 1, pageSize: 10 });
    } catch (error) {
      message.error('删除失败');
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case '上架':
        return <Tag color="green">{status}</Tag>;
      case '下架':
        return <Tag color="grey">{status}</Tag>;
      case '售罄':
        return <Tag color="red">{status}</Tag>;
      default:
        return <Tag color="blue">未知</Tag>;
    }
  };

  const handlePreviewImage = (url: string) => {
    setPreviewVisible(true);
    setPreviewImage(url);
  };
  // 获取变体信息
  const [productVariant, setProductVariant] = useState<
    Map<string, ProductVariant[]>
  >(new Map([]));
  const { getVariants } = useProducts();

  const getProductVariant = async (product: Product) => {
    try {
      const result = await getVariants(product.uuid);
      if (result?.length) {
        const newProductVariant = productVariant;
        newProductVariant.set(product.uuid, result);
        setProductVariant(newProductVariant);
      }
    } catch (e) {
      // ignore
    }
  };

  // 跳转编辑
  const handleJump = (key: 'detail' | 'edit', record: Product) => {
    navigate(`../${key}/${record.uuid}`);
  };

  const columns: ProColumns<Product>[] = [
    {
      title: '产品图片',
      dataIndex: 'images',
      key: 'images',
      hideInSearch: true,
      render: (_, record) => {
        // 图片数量大于0时显示第一张图片
        if (record.image_list.length > 0) {
          return (
            <img
              src={'/public/' + record.image_list[0]}
              alt="product"
              style={{ width: 50 }}
              onClick={() =>
                handlePreviewImage('/public/' + record.image_list[0])
              }
            />
          );
        }
        return <Typography.Text type="secondary">暂无图片</Typography.Text>;
      },
    },
    { title: '产品名称', dataIndex: 'name', key: 'name' },
    // {
    //   title: '产品描述',
    //   dataIndex: 'description',
    //   key: 'description',
    //   hideInSearch: true,
    // },
    {
      title: '产品类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{type}</Tag>,
    },
    {
      title: '产品状态',
      dataIndex: 'status',
      key: 'status',
      render: (__, { status }) => renderStatus(status),
    },
    {
      title: '警戒库存',
      dataIndex: 'stock_warning',
      key: 'stock_warning',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleJump('detail', record)}
            className="mr-2"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleJump('edit', record)}
            className="mr-2"
          />
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => handleDeleteProduct(record.uuid)}
            okText="是"
            cancelText="否"
          >
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
        rowKey="id"
        actionRef={actionRef}
        expandable={{
          expandedRowRender: (record) => {
            getProductVariant(record);
            return (
              <div>
                {productVariant.get(record.uuid)?.map((item) => {
                  return (
                    <div key={item.id} className="flex gap-3 mb-3">
                      <div>{item.name}</div>
                      <div>
                        {item.product_variants_options.map((opt) => {
                          return <div key={opt.uuid}>{opt.name}</div>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          },

          // <p style={{ margin: 0 }}>{record.description}</p>
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        dataSource={list}
        loading={loading}
        pagination={{
          total,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            type="primary"
          >
            添加产品
          </Button>,
        ]}
      />
      <Modal
        title="预览图片"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageContainer>
  );
};

export default ProductManagement;
