import type { Effect, Reducer, Subscription } from '@umijs/max';
import { serverApi } from '@/services/system/server';

export interface ServerState {
  list: any[];
  total: number;
  loading: boolean;
}

const ServerModel = {
  namespace: 'server',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *getList({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(serverApi.getServerList, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *create({ payload, callback }: any, { call }: any) {
      const res = yield call(serverApi.createServer, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }: any, { call }: any) {
      const res = yield call(serverApi.updateServer, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }: any, { call }: any) {
      const res = yield call(serverApi.deleteServer, payload);
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

  subscriptions: { setup() {} },
};

export default ServerModel;
