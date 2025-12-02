import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useReturns() {
  const dispatch = useDispatch();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchList = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'returns/getList', payload: params, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) {
        setList(res.data || []);
      } else {
        setList([]);
      }
    } });
  }, [dispatch]);

  const approve = useCallback((params: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'returns/approve', payload: params, callback: (res: any) => {
        resolve(res);
      } });
    }), [dispatch]);

  const reject = useCallback((params: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'returns/reject', payload: params, callback: (res: any) => {
        resolve(res);
      } });
    }), [dispatch]);

  return { list, loading, fetchList, approve, reject };
}

export default useReturns;
