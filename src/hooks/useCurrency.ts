import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from '@umijs/max';

export function useCurrency() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState<any[]>([]);

  const fetchList = useCallback((params: any) => {
    dispatch({ type: 'currency/getList', payload: params });
  }, [dispatch]);

  const addCurrency = useCallback((data: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'currency/addCurrency', payload: data, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const updateCurrency = useCallback((data: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'currency/updateCurrency', payload: data, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const deleteCurrency = useCallback((uuid: string) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'currency/deleteCurrency', payload: { uuid }, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const getOptions = useCallback(() =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'currency/getOptions', callback: (res: any) => (res?.code === 200 ? resolve(res.data || []) : reject(res)) });
    }), [dispatch]);

  return { fetchList, addCurrency, updateCurrency, deleteCurrency, getOptions, options };
}

export default useCurrency;
