import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useServers() {
  const dispatch = useDispatch();
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'server/getList', payload: params, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) {
        setList(res.data?.data || []);
        setTotal(res.data?.total || 0);
      } else {
        setList([]);
        setTotal(0);
      }
    } });
  }, [dispatch]);

  const create = useCallback((data: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'server/create', payload: data, callback: (res: any) => resolve(res) });
    }), [dispatch]);

  const update = useCallback((data: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'server/update', payload: data, callback: (res: any) => resolve(res) });
    }), [dispatch]);

  const remove = useCallback((data: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'server/remove', payload: data, callback: (res: any) => resolve(res) });
    }), [dispatch]);

  return { list, total, loading, fetchList, create, update, remove };
}

export default useServers;
