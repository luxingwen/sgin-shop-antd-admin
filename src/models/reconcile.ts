import type { Effect, Reducer, Subscription } from '@umijs/max';
import { paymentApi } from '@/services/system/payment';

export interface ReconcileState {
  list: any[];
  loading: boolean;
}

export interface ReconcileModelType {
  namespace: 'reconcile';
  state: ReconcileState;
  effects: {
    getUnmatched: Effect;
    run: Effect;
    export: Effect;
    manualMark: Effect;
  };
  reducers: {
    setLoading: Reducer<ReconcileState>;
    save: Reducer<ReconcileState>;
  };
  subscriptions: { setup: Subscription };
}

const ReconcileModel: ReconcileModelType = {
  namespace: 'reconcile',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *getUnmatched({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(paymentApi.listUnmatched, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data || [] } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *run({ payload, callback }, { call }) {
      const res = yield call(paymentApi.runReconcile, payload);
      if (callback) callback(res);
    },

    *export({ payload, callback }, { call }) {
      const res = yield call(paymentApi.exportUnmatched, payload);
      if (callback) callback(res);
    },

    *manualMark({ payload, callback }, { call }) {
      const res = yield call(paymentApi.manualMark, payload);
      if (callback) callback(res);
    },
  },

  reducers: {
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    save(state, { payload }) {
      state.list = payload.list || [];
    },
  },

  subscriptions: { setup() {} },
};

export default ReconcileModel;
