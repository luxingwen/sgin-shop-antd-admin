import type { Effect, Reducer, Subscription } from '@umijs/max';
import { returnApi } from '@/services/return';

export interface ReturnsState {
  list: any[];
  loading: boolean;
}

const ReturnsModel = {
  namespace: 'returns',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *getList({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(returnApi.getMyReturns, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data || [] } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *approve({ payload, callback }: any, { call }: any) {
      const res = yield call(returnApi.adminApprove, payload);
      if (callback) callback(res);
    },

    *reject({ payload, callback }: any, { call }: any) {
      const res = yield call(returnApi.adminReject, payload);
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

  subscriptions: { setup() {} },
};

export default ReturnsModel;
