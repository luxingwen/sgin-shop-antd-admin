import type { Effect, Reducer } from '@umijs/max';
import { apiApi } from '@/services/system/api';

export interface ApiState {
  list: any[];
  total: number;
  loading: boolean;
}

const ApiModel = {
  namespace: 'api',
  state: { list: [], total: 0, loading: false },
  effects: {
    *getList({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(apiApi.getApis, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *remove({ payload, callback }: any, { call }: any) {
      const res = yield call(apiApi.deleteApi, payload);
      if (callback) callback(res);
    },

    *add({ payload, callback }: any, { call }: any) {
      const res = yield call(apiApi.addApi, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }: any, { call }: any) {
      const res = yield call(apiApi.updateApi, payload);
      if (callback) callback(res);
    },
  },
  reducers: {
    setLoading(state: any, { payload }: any) {
      state.loading = payload;
    },
    save(state: any, { payload }: any) {
      state.list = payload.list || [];
      state.total = payload.total || 0;
    },
  },
};

export default ApiModel;
