import type { Effect, Reducer } from '@umijs/max';
import { categoryServices } from '@/services/product/category';

export interface CategoryState {
  list: any[];
  loading: boolean;
}

const CategoryModel = {
  namespace: 'category',
  state: { list: [], loading: false },
  effects: {
    *getAll({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(categoryServices.getAllProductCategories, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data || [] } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *add({ payload, callback }: any, { call }: any) {
      const res = yield call(categoryServices.addProductCategory, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }: any, { call }: any) {
      const res = yield call(categoryServices.updateProductCategory, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }: any, { call }: any) {
      const res = yield call(categoryServices.deleteProductCategory, payload);
      if (callback) callback(res);
    },
  },
  reducers: {
    setLoading(state: any, { payload }: any) {
      state.loading = payload;
    },
    save(state: any, { payload }: any) {
      state.list = payload.list || [];
    },
  },
};

export default CategoryModel;
