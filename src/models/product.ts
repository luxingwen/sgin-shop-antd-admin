import type { Effect, Reducer, Subscription } from '@umijs/max';
import { productServices } from '@/services/product/product';
import type { Product } from '@/services/types';

export interface ProductState {
  list: Product[];
  total: number;
  loading: boolean;
  current?: Product | null;
  query: Record<string, any>;
}

export interface ProductModelType {
  namespace: 'product';
  state: ProductState;
  effects: {
    fetchList: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    getProduct: Effect;
    getVariants: Effect;
  };
  reducers: {
    setLoading: Reducer<ProductState>;
    save: Reducer<ProductState>;
    setCurrent: Reducer<ProductState>;
    setQuery: Reducer<ProductState>;
  };
  subscriptions: { setup: Subscription };
}

const ProductModel: ProductModelType = {
  namespace: 'product',

  state: {
    list: [],
    total: 0,
    loading: false,
    current: null,
    query: {},
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const query = payload || (yield select((state: any) => state.product.query));
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(productServices.getProducts, query);
        yield put({ type: 'save', payload: { list: res.data?.list || res.data?.items || [], total: res.data?.total || 0, query } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *create({ payload, callback }, { call, put }) {
      const res = yield call(productServices.addProduct, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *update({ payload, callback }, { call, put }) {
      const res = yield call(productServices.updateProduct, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call, put }) {
      const res = yield call(productServices.deleteProduct, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *getProduct({ payload, callback }, { call }) {
      const res = yield call(productServices.getProduct, payload);
      if (callback) callback(res);
    },

    *getVariants({ payload, callback }, { call }) {
      const res = yield call(productServices.getProductVariantById, payload);
      if (callback) callback(res);
    },
  },

  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    save(state, { payload }) {
      state.list = payload.list;
      state.total = payload.total;
      state.query = payload.query || state.query;
    },
    setCurrent(state, { payload }) {
      state.current = payload || null;
    },
    setQuery(state, { payload }) {
      state.query = payload || {};
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      if (!history || typeof history.listen !== 'function') return;
      return history.listen((location: any) => {
        const pathname = location && typeof location === 'object' ? location.pathname : (typeof location === 'string' ? location : undefined);
        if (typeof pathname === 'string' && pathname.includes('/product/list')) {
          dispatch({ type: 'fetchList' });
        }
      });
    },
  },
};

export default ProductModel;
