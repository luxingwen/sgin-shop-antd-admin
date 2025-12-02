import type { Effect, Reducer, Subscription } from '@umijs/max';
import { currencyApi } from '@/services/system/currency';

export interface CurrencyState {
  list: any[];
  total: number;
  loading: boolean;
}

export interface CurrencyModelType {
  namespace: 'currency';
  state: CurrencyState;
  effects: {
    getList: Effect;
    addCurrency: Effect;
    updateCurrency: Effect;
    deleteCurrency: Effect;
    getOptions: Effect;
  };
  reducers: {
    setLoading: Reducer<CurrencyState>;
    save: Reducer<CurrencyState>;
  };
  subscriptions: { setup: Subscription };
}

const CurrencyModel: CurrencyModelType = {
  namespace: 'currency',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(currencyApi.getCurrencies, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *addCurrency({ payload, callback }, { call }) {
      const res = yield call(currencyApi.addCurrency, payload);
      if (callback) callback(res);
    },

    *updateCurrency({ payload, callback }, { call }) {
      const res = yield call(currencyApi.updateCurrency, payload);
      if (callback) callback(res);
    },

    *deleteCurrency({ payload, callback }, { call }) {
      const res = yield call(currencyApi.deleteCurrency, payload);
      if (callback) callback(res);
    },

    *getOptions({ callback }, { call }) {
      const res = yield call(currencyApi.getCurrencyOptions);
      if (callback) callback(res);
    },
  },

  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    save(state, { payload }) {
      state.list = payload.list || [];
      state.total = payload.total || 0;
    },
  },

  subscriptions: { setup() {} },
};

export default CurrencyModel;
