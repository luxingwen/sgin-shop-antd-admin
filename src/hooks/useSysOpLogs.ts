import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useSysOpLogs() {
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'log/getOpLogs', payload: params, callback: (res: any) => {
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

  return { list, total, loading, fetchList };
}
