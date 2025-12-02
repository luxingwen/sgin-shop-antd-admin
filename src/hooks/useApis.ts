import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useApis() {
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'api/getList', payload: params, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) {
        setList(res.data?.data || []);
        setTotal(res.data?.total || 0);
      } else {
        setList([]);
        setTotal(0);
      }
    }});
  }, [dispatch]);

  const remove = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'api/remove', payload: { uuid }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    }), [dispatch, fetchList]);

  const add = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'api/add', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    }), [dispatch, fetchList]);

  const update = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'api/update', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    }), [dispatch, fetchList]);

  return { list, total, loading, fetchList, remove, add, update };
}
