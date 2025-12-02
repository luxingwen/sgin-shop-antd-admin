import { useCallback } from 'react';
import { useDispatch, useSelector } from '@umijs/max';

export interface ProductsState {
  list: any[];
  total: number;
  loading: boolean;
  current?: any;
  query?: any;
}

export function useProducts() {
  const dispatch = useDispatch();
  const { list, total, loading, current, query } =
    (useSelector((s: any) => s.product) as ProductsState) || ({} as ProductsState);

  const fetchList = useCallback(
    (payload: any) => {
      dispatch({ type: 'product/fetchList', payload });
    },
    [dispatch]
  );

  const remove = useCallback(
    (uuids: string | string[]) =>
      new Promise<void>((resolve) => {
        dispatch({ type: 'product/remove', payload: { uuids: Array.isArray(uuids) ? uuids : [uuids] }, callback: resolve });
      }),
    [dispatch]
  );

  const create = useCallback(
    (values: any) =>
      new Promise<void>((resolve, reject) => {
        dispatch({ type: 'product/create', payload: values, callback: (res: any) => (res?.code === 200 ? resolve() : reject(res)) });
      }),
    [dispatch]
  );

  const update = useCallback(
    (values: any) =>
      new Promise<void>((resolve, reject) => {
        dispatch({ type: 'product/update', payload: values, callback: (res: any) => (res?.code === 200 ? resolve() : reject(res)) });
      }),
    [dispatch]
  );

  const setCurrent = useCallback(
    (p: any) => {
      dispatch({ type: 'product/setCurrent', payload: p });
    },
    [dispatch]
  );

  const getVariants = useCallback(
    (uuid: string) =>
      new Promise<any>((resolve, reject) => {
        dispatch({ type: 'product/getVariants', payload: { uuid }, callback: (res: any) => (res?.code === 200 ? resolve(res.data) : reject(res)) });
      }),
    [dispatch],
  );

  const getProduct = useCallback(
    (uuid: string) =>
      new Promise<any>((resolve, reject) => {
        dispatch({ type: 'product/getProduct', payload: { uuid }, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
      }),
    [dispatch],
  );

  return { list, total, loading, current, query, fetchList, remove, create, update, setCurrent, getVariants, getProduct };
}
