import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function useReconcile() {
  const dispatch = useDispatch();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUnmatched = useCallback((params: any = {}) => {
    setLoading(true);
    dispatch({ type: 'reconcile/getUnmatched', payload: params, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) {
        setList(res.data || []);
      } else {
        setList([]);
      }
    } });
  }, [dispatch]);

  const run = useCallback((params: any = {}) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'reconcile/run', payload: params, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      } });
    }), [dispatch]);

  const exportUnmatched = useCallback((params: any = {}) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'reconcile/export', payload: params, callback: (res: any) => {
        resolve(res);
      } });
    }), [dispatch]);

  const manualMark = useCallback((params: any) =>
    new Promise<any>((resolve) => {
      dispatch({ type: 'reconcile/manualMark', payload: params, callback: (res: any) => {
        resolve(res);
      } });
    }), [dispatch]);

  return { list, loading, fetchUnmatched, run, exportUnmatched, manualMark };
}

export default useReconcile;
