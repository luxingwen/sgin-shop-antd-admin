import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

function formatCategoryTree(categories = []) {
  const map: Record<string, any> = {};
  categories.forEach((category: any) => {
    map[category.uuid] = { ...category, key: category.uuid, title: category.name, children: [] };
  });
  categories.forEach((category: any) => {
    if (category.parent_uuid && map[category.parent_uuid]) {
      map[category.parent_uuid].children.push(map[category.uuid]);
    }
  });
  return Object.values(map).filter((category: any) => !category.parent_uuid);
}

export function useProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchCategories = useCallback(() => {
    setLoading(true);
    dispatch({ type: 'category/getAll', payload: {}, callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) setCategories(formatCategoryTree(res.data || []));
      else setCategories([]);
    }});
  }, [dispatch]);

  const remove = useCallback((uuid: string) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'category/remove', payload: { uuid }, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchCategories();
        resolve(res);
      }});
    }), [dispatch, fetchCategories]);

  const add = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'category/add', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchCategories();
        resolve(res);
      }});
    }), [dispatch, fetchCategories]);

  const update = useCallback((values: any) =>
    new Promise<any>((resolve) => {
      setLoading(true);
      dispatch({ type: 'category/update', payload: values, callback: async (res: any) => {
        setLoading(false);
        if (res?.code === 200) fetchCategories();
        resolve(res);
      }});
    }), [dispatch, fetchCategories]);

  return { categories, loading, fetchCategories, remove, add, update };
}
