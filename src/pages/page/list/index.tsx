import { usePages } from '@/hooks/usePages';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import { history } from '@umijs/max';
import { Button, message, Modal, Popconfirm, Tag, Typography } from 'antd';
import { useRef, useState, useEffect } from 'react';

const PageManagement = () => {
  const actionRef = useRef();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [pageDetails, setPageDetails] = useState<any>({});

  const handleAddPage = () => {
    history.push('/page/create');
  };

  const { list, total, loading, fetchList, remove, getPage } = usePages();

  // 加载第一页
  useEffect(() => {
    fetchList({ page: 1, pageSize: 10 });
  }, [fetchList]);

  const handleDeletePage = async (uuid) => {
    try {
      await remove(uuid);
      message.success('删除成功');
      fetchList({ page: 1, pageSize: 10 });
    } catch (error) {
      message.error('删除失败');
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'draft':
        return <Tag color="blue">草稿</Tag>;
      case 'published':
        return <Tag color="green">已发布</Tag>;
      default:
        return <Tag color="grey">未知</Tag>;
    }
  };

  const handlePreviewPage = async (uuid) => {
    try {
      const response = await getPage(uuid);
      if (response.code === 200) {
        setPageDetails(response.data);
        setPreviewVisible(true);
      } else {
        message.error('获取页面详情失败');
      }
    } catch (error) {
      message.error('获取页面详情失败');
    }
  };

  const columns = [
    { title: '页面标题', dataIndex: 'title', key: 'title' },
    { title: '页面路径', dataIndex: 'slug', key: 'slug' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
    },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at', hideInSearch: true },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreviewPage(record.uuid)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => handleDeletePage(record.uuid)}
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
            onClick={handleAddPage}
            type="primary"
          >
            创建页面
          </Button>,
        ]}
      />
      <Modal
        title="页面详情"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Typography.Paragraph>{pageDetails.data}</Typography.Paragraph>
      </Modal>
    </PageContainer>
  );
};

export default PageManagement;
