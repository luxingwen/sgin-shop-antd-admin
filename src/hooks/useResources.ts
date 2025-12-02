import { useCallback } from 'react';
import { useDispatch, useSelector } from '@umijs/max';

export interface ResourcesState {
  list: any[];
  total: number;
  loading: boolean;
  query?: any;
}

export function useResources() {
  const dispatch = useDispatch();
  const { list, total, loading, query } = (useSelector((s: any) => s.resource) as ResourcesState) || ({} as ResourcesState);

  const getList = useCallback((payload: any) => {
    dispatch({ type: 'resource/getList', payload });
  }, [dispatch]);

  const createResource = useCallback((formData: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'resource/createResource', payload: formData, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const updateResource = useCallback((payload: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'resource/updateResource', payload, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const deleteResource = useCallback((uuid: string) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'resource/deleteResource', payload: { uuid }, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  const createFolder = useCallback((payload: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch({ type: 'resource/createFolder', payload, callback: (res: any) => (res?.code === 200 ? resolve(res) : reject(res)) });
    }), [dispatch]);

  return { list, total, loading, query, getList, createResource, updateResource, deleteResource, createFolder };
}

export default useResources;
