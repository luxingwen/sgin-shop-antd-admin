import type { Effect, Reducer } from '@umijs/max';
import { logApi } from '@/services/system/log';

export interface LogState {
  opList: any[];
  loginList: any[];
  totalOp: number;
  totalLogin: number;
  loading: boolean;
}

const LogModel = {
  namespace: 'log',
  state: { opList: [], loginList: [], totalOp: 0, totalLogin: 0, loading: false },
  effects: {
    *getOpLogs({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(logApi.getSysOpLogs, payload);
        if (callback) callback(res);
        yield put({ type: 'saveOp', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *getLoginLogs({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(logApi.getSysLoginLogs, payload);
        if (callback) callback(res);
        yield put({ type: 'saveLogin', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
  reducers: {
    setLoading(state: any, { payload }: any) {
      state.loading = payload;
    },
    saveOp(state: any, { payload }: any) {
      state.opList = payload.list || [];
      state.totalOp = payload.total || 0;
    },
    saveLogin(state: any, { payload }: any) {
      state.loginList = payload.list || [];
      state.totalLogin = payload.total || 0;
    },
  },
};

export default LogModel;
