import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

function formatTree(items = []) {
  const map: Record<string, any> = {};
  items.forEach((item: any) => {
    map[item.uuid] = { ...item, key: item.uuid, title: item.name, children: [] };
  });
  items.forEach((item: any) => {
    if (item.parent_uuid && map[item.parent_uuid]) {
      map[item.parent_uuid].children.push(map[item.uuid]);
    }
  });
  return Object.values(map).filter((item: any) => !item.parent_uuid);
}

export function usePermissions() {
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchAll = useCallback(() => {
    setLoading(true);
    dispatch({ type: 'permission/fetchAll', payload: {}, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) setTree(formatTree(res.data?.data || []));
      else setTree([]);
    }});
  }, [dispatch]);

  const fetchUserPermissions = useCallback((user_uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/getUserPermissionInfo', payload: { uuid: user_uuid }, callback: (res: any) => {
        setLoading(false);
        if (res?.code === 200) resolve(res.data);
        else resolve([]);
      }});
    }), [dispatch]);

  const bindUserPermissions = useCallback((user_uuid: string, permission_uuids: string[]) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/addUserPermission', payload: { user_uuid, permission_uuids }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  const remove = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/remove', payload: { uuid }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchAll();
        resolve(res);
      }});
    }), [dispatch, fetchAll]);

  const add = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/add', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchAll();
        resolve(res);
      }});
    }), [dispatch, fetchAll]);

  const update = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/update', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchAll();
        resolve(res);
      }});
    }), [dispatch, fetchAll]);

  const getPermissionInfo = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/getPermissionInfo', payload: { uuid }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  const fetchPermissionMenus = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/getPermissionMenus', payload: { uuid }, callback: (res: any) => {
        setLoading(false);
        if (res?.code === 200) resolve(res.data);
        else resolve([]);
      }});
    }), [dispatch]);

  const bindPermissionMenus = useCallback((permission_uuid: string, menu_uuids: string[]) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'permission/bindPermissionMenus', payload: { permission_uuid, menu_uuids }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  return { tree, loading, fetchAll, fetchUserPermissions, bindUserPermissions, remove, add, update, getPermissionInfo, fetchPermissionMenus, bindPermissionMenus };
}
