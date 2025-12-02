// menu/permission services moved to hooks
import { useMenus } from '@/hooks/useMenus';
import { usePermissions } from '@/hooks/usePermissions';

import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Col, Row, Tree, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BindMenusPage = () => {
  const [menuTree, setMenuTree] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [permissionInfo, setPermissionInfo] = useState<any>({});
  const { permissionId } = useParams(); // 从路由获取权限ID
  const { menus: hookMenus, fetchMenus } = useMenus();
  const { getPermissionInfo, fetchPermissionMenus, bindPermissionMenus } = usePermissions();

  useEffect(() => {
    const init = async () => {
      try {
        const info = await getPermissionInfo(permissionId);
        setPermissionInfo(info.data);
      } catch (e) {
        message.error('获取权限信息失败');
      }

      try {
        const perms = await fetchPermissionMenus(permissionId);
        const menuUuids = (perms || []).map((m: any) => m.menu_uuid);
        setSelectedKeys(menuUuids);
      } catch (e) {
        message.error('获取权限已绑定菜单失败');
      }

      try {
        await fetchMenus();
        setMenuTree(hookMenus);
      } catch (e) {
        message.error('获取菜单列表失败');
      }
    };

    init();
  }, [permissionId, fetchMenus, getPermissionInfo, fetchPermissionMenus, hookMenus]);

  const handleBindMenus = async () => {
    try {
      await bindPermissionMenus(permissionId, selectedKeys as any[]);
      message.success('菜单绑定成功');
      history.push('/system/permission'); // 绑定完成后返回权限列表
    } catch (error) {
      message.error('菜单绑定失败');
    }
  };

  return (
    <PageContainer>
      <Card title="权限信息" bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <strong>权限名称: </strong>
            {(permissionInfo as any).name}
          </Col>
        </Row>
      </Card>
      <Card title="绑定菜单" bordered={false}>
        <Tree
          checkable
          checkedKeys={selectedKeys}
          onCheck={(checkedKeys: any) => setSelectedKeys(checkedKeys as any[])}
          treeData={menuTree}
        />
        <Button
          type="primary"
          onClick={handleBindMenus}
          style={{ marginTop: 16 }}
        >
          绑定菜单
        </Button>
      </Card>
    </PageContainer>
  );
};

export default BindMenusPage;
