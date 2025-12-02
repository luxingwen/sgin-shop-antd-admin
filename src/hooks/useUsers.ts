import { useCallback } from 'react';
import { useDispatch, useSelector } from '@umijs/max';

export interface UsersState {
  list: any[];
  total: number;
  loading: boolean;
  current?: any;
  query?: any;
}

export function useUsers() {
  const dispatch = useDispatch();
  const { list, total, loading, current, query } =
    (useSelector((s: any) => s.user) as UsersState) || ({} as UsersState);

  const fetchList = useCallback(
    (payload: any) => {
      dispatch({ type: 'user/fetchList', payload });
    },
    [dispatch]
  );

  const remove = useCallback(
    (uuid: string) =>
      new Promise<void>((resolve) => {
        dispatch({ type: 'user/remove', payload: uuid, callback: resolve });
      }),
    [dispatch]
  );

  const create = useCallback(
    (values: any) =>
      new Promise<void>((resolve, reject) => {
        dispatch({
          type: 'user/create',
          payload: values,
          callback: (res: any) => (res?.code === 200 ? resolve() : reject(res)),
        });
      }),
    [dispatch]
  );

  const update = useCallback(
    (values: any) =>
      new Promise<void>((resolve, reject) => {
        dispatch({
          type: 'user/update',
          payload: values,
          callback: (res: any) => (res?.code === 200 ? resolve() : reject(res)),
        });
      }),
    [dispatch]
  );

  const setCurrent = useCallback(
    (user: any) => {
      dispatch({ type: 'user/setCurrent', payload: user });
    },
    [dispatch]
  );

  const getUser = useCallback(
    (uuid: string) =>
      new Promise<any>((resolve, reject) => {
        dispatch({
          type: 'user/getUser',
          payload: uuid,
          callback: (res: any) => (res?.code === 200 ? resolve(res.data) : reject(res)),
        });
      }),
    [dispatch]
  );

  const getOptions = useCallback(
    () =>
      new Promise<any>((resolve, reject) => {
        dispatch({
          type: 'user/getOptions',
          callback: (res: any) => (res?.code === 200 ? resolve(res.data) : reject(res)),
        });
      }),
    [dispatch]
  );

  return { list, total, loading, current, query, fetchList, remove, create, update, setCurrent, getUser, getOptions };
}
