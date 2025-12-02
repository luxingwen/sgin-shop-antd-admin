import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useOrders() {
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'order/getList', payload: params, callback: (res: any) => {
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

  const remove = useCallback((id: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'order/remove', payload: { id }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchList();
        resolve(res);
      }});
    }), [dispatch, fetchList]);

  const getOrderItems = useCallback((order_id: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'order/getOrderItems', payload: { order_id }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    }), [dispatch]);

  return { list, total, loading, fetchList, remove, getOrderItems };
}
