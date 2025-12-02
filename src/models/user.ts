import type { Effect, Reducer, Subscription } from '@umijs/max';
import { userService } from '@/services/user';
import type { User } from '@/services/types';

export interface UserState {
  list: User[];
  total: number;
  loading: boolean;
  current?: User | null;
  query: Record<string, any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    fetchList: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    batchDelete: Effect;
    getUser: Effect;
    getOptions: Effect;
    login: Effect;
    getMyUserInfo: Effect;
    updateAvatar: Effect;
  };
  reducers: {
    setLoading: Reducer<UserState>;
    save: Reducer<UserState>;
    setCurrent: Reducer<UserState>;
    setQuery: Reducer<UserState>;
  };
  subscriptions: { setup: Subscription };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    list: [],
    total: 0,
    loading: false,
    current: null,
    query: {},
  },

  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const query = payload || (yield select((state: any) => state.user.query));
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(userService.getUsers, query);
        yield put({
          type: 'save',
          payload: {
            list: res.data?.list || res.data?.items || [],
            total: res.data?.total || 0,
            query,
          },
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *create({ payload, callback }, { call, put }) {
      const res = yield call(userService.addUser, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *update({ payload, callback }, { call, put }) {
      const res = yield call(userService.updateUser, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call, put }) {
      const res = yield call(userService.deleteUser, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *batchDelete({ payload, callback }, { call, put }) {
      const res = yield call(userService.deleteUser, payload);
      if (res?.code === 200) {
        yield put({ type: 'fetchList' });
      }
      if (callback) callback(res);
    },

    *getUser({ payload, callback }, { call }) {
      const res = yield call(userService.getUserInfo, payload);
      if (callback) callback(res);
    },

    *getMyUserInfo({ payload, callback }, { call }) {
      const res = yield call(userService.getMyUserInfo, payload);
      if (callback) callback(res);
    },
    *updateAvatar({ payload, callback }, { call, put }) {
      const res = yield call(userService.updateAvatar, payload);
      if (res?.code === 200) {
        yield put({ type: 'getMyUserInfo' });
      }
      if (callback) callback(res);
    },

    *getOptions({ callback }, { call }) {
      const res = yield call(userService.getUserOptions);
      if (callback) callback(res);
    },
    *login({ payload, callback }, { call }) {
      const res = yield call(userService.login, payload);
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
        if (typeof pathname === 'string' && pathname.includes('/user/manager')) {
          dispatch({ type: 'fetchList' });
        }
      });
    },
  },
};

export default UserModel;
