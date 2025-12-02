import { useCallback } from 'react';
import { useDispatch } from '@umijs/max';

export function useAuth() {
  const dispatch = useDispatch();

  const login = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      dispatch({
        type: 'user/login',
        payload: values,
        callback: (res: any) => {
          resolve(res);
        },
      });
    }),
  [dispatch]);

  return { login };
}

export default useAuth;
