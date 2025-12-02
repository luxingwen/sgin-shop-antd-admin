import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function usePayments() {
  const dispatch = useDispatch();
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'payment/getList', payload: params, callback: (res: any) => {
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

  const updateStatus = useCallback(({ uuid, status }: { uuid: string; status: number }) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'payment/updateStatus', payload: { uuid, status }, callback: (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    });
  }, [dispatch, fetchList]);

  return { list, total, loading, fetchList, updateStatus };
}
