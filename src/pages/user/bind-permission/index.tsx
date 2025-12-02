import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Col, Row, Tree, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useUsers } from '@/hooks/useUsers';

const BindPermissionsPage = () => {
  const [permissionTree, setPermissionTree] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [userInfo, setUserInfo] = useState<any>({});
  const { userId } = useParams(); // 从路由获取用户ID

  const { tree, fetchAll, fetchUserPermissions, bindUserPermissions } = usePermissions();
  const { getUser } = useUsers();

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUser(userId);
        setUserInfo(user);
      } catch (e) {
        message.error('获取用户信息失败');
      }

      try {
        const perms = await fetchUserPermissions(userId);
        const permissionUuids = (perms || []).map((p: any) => p.permission_uuid);
        setSelectedKeys(permissionUuids);
      } catch (e) {
        message.error('获取用户已绑定权限失败');
      }

      try {
        await fetchAll();
        setPermissionTree(tree);
      } catch (e) {
        message.error('获取权限列表失败');
      }
    };

    init();
  }, [userId, fetchAll, fetchUserPermissions, getUser, tree]);

  const handleBindPermissions = async () => {
    try {
      await bindUserPermissions(userId, selectedKeys as any[]);
      message.success('权限绑定成功');
      history.push('/system/user'); // 绑定完成后返回用户列表
    } catch (error) {
      message.error('权限绑定失败');
    }
  };

  return (
    <PageContainer>
      <Card title="用户信息" bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <strong>用户名: </strong>
            {userInfo.username}
          </Col>
          <Col span={12}>
            <strong>邮箱: </strong>
            {userInfo.email}
          </Col>
        </Row>
      </Card>
      <Card title="绑定权限" bordered={false}>
            <Tree
              checkable
              checkedKeys={selectedKeys}
              onCheck={(checkedKeys: any) => setSelectedKeys(checkedKeys as any[])}
              treeData={permissionTree}
            />
        <Button
          type="primary"
          onClick={handleBindPermissions}
          style={{ marginTop: 16 }}
        >
          绑定权限
        </Button>
      </Card>
    </PageContainer>
  );
};

export default BindPermissionsPage;
