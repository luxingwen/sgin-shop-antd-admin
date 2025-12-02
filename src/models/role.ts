import type { Effect, Reducer, Subscription } from '@umijs/max';
import { roleService } from '@/services/role';

export interface RoleState {
  list: any[];
  total: number;
  loading: boolean;
}

export interface RoleModelType {
  namespace: 'role';
  state: RoleState;
  effects: {
    fetchList: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    setLoading: Reducer<RoleState>;
    save: Reducer<RoleState>;
  };
  subscriptions: { setup: Subscription };
}

const RoleModel: RoleModelType = {
  namespace: 'role',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(roleService.getRoles, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *add({ payload, callback }, { call }) {
      const res = yield call(roleService.addRole, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }, { call }) {
      const res = yield call(roleService.updateRole, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call }) {
      const res = yield call(roleService.deleteRole, payload);
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

export default RoleModel;
