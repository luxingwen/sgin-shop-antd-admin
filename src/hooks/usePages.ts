import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function usePages() {
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'page/getList', payload: params, callback: (res: any) => {
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

  const remove = useCallback((uuid: string) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'page/remove', payload: { uuid }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    });
  }, [dispatch, fetchList]);

  const getPage = useCallback((uuid: string) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'page/getPage', payload: { uuid }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    });
  }, [dispatch]);

  return { list, total, loading, fetchList, remove, getPage };
}
