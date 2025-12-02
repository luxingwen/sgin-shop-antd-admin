import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

function formatMenuTree(menus = []) {
  const map: Record<string, any> = {};
  menus.forEach((menu: any) => {
    map[menu.uuid] = { ...menu, key: menu.uuid, title: menu.name, children: [] };
  });
  menus.forEach((menu: any) => {
    if (menu.parent_uuid && map[menu.parent_uuid]) {
      map[menu.parent_uuid].children.push(map[menu.uuid]);
    }
  });
  return Object.values(map).filter((menu: any) => !menu.parent_uuid);
}

export function useMenus() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchMenus = useCallback(() => {
    setLoading(true);
    dispatch({ type: 'menu/fetchMenus', payload: {}, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) setMenus(formatMenuTree(res.data?.data || []));
      else setMenus([]);
    }});
  }, [dispatch]);

  const remove = useCallback((uuid: string) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'menu/deleteMenu', payload: { uuid }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchMenus();
        resolve(res);
      }});
    });
  }, [dispatch, fetchMenus]);

  const add = useCallback((values: any) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'menu/addMenu', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchMenus();
        resolve(res);
      }});
    });
  }, [dispatch, fetchMenus]);

  const update = useCallback((values: any) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'menu/updateMenu', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchMenus();
        resolve(res);
      }});
    });
  }, [dispatch, fetchMenus]);

  const getMenuInfo = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'menu/getMenuInfo', payload: { uuid }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  const fetchMenuAPIs = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'menu/getMenuAPIs', payload: { uuid }, callback: (res: any) => {
        setLoading(false);
        if (res?.code === 200) resolve(res.data);
        else resolve([]);
      }});
    }), [dispatch]);

  const bindMenuAPIs = useCallback((menu_uuid: string, api_uuids: string[]) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'menu/addMenuAPI', payload: { menu_uuid, api_uuids }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  return { menus, loading, fetchMenus, remove, add, update, getMenuInfo, fetchMenuAPIs, bindMenuAPIs };
}
