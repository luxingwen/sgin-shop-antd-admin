import type { Effect, Reducer, Subscription } from '@umijs/max';
import { permissionApi } from '@/services/system/permission';

export interface PermissionState {
  list: any[];
  loading: boolean;
}

export interface PermissionModelType {
  namespace: 'permission';
  state: PermissionState;
  effects: {
    fetchAll: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
    getPermissionInfo: Effect;
    getPermissionMenus: Effect;
    bindPermissionMenus: Effect;
    getUserPermissions: Effect;
    addUserPermission: Effect;
    getUserPermissionInfo: Effect;
    updateUserPermission: Effect;
    deleteUserPermission: Effect;
  };
  reducers: {
    setLoading: Reducer<PermissionState>;
    save: Reducer<PermissionState>;
  };
  subscriptions: { setup: Subscription };
}

const PermissionModel: PermissionModelType = {
  namespace: 'permission',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetchAll({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(permissionApi.getPermissions, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [] } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *add({ payload, callback }, { call }) {
      const res = yield call(permissionApi.addPermission, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }, { call }) {
      const res = yield call(permissionApi.updatePermission, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call }) {
      const res = yield call(permissionApi.deletePermission, payload);
      if (callback) callback(res);
    },

    *getPermissionInfo({ payload, callback }, { call }) {
      const res = yield call(permissionApi.getPermissionInfo, payload);
      if (callback) callback(res);
    },

    *getPermissionMenus({ payload, callback }, { call }) {
      const res = yield call(permissionApi.getPermissionMenuInfoByPermissionUuid, payload);
      if (callback) callback(res);
    },

    *bindPermissionMenus({ payload, callback }, { call }) {
      const res = yield call(permissionApi.addPermissionMenu, payload);
      if (callback) callback(res);
    },
    *getUserPermissions({ payload, callback }, { call }) {
      const res = yield call(permissionApi.getUserPermissions, payload);
      if (callback) callback(res);
    },

    *addUserPermission({ payload, callback }, { call }) {
      const res = yield call(permissionApi.addUserPermission, payload);
      if (callback) callback(res);
    },

    *getUserPermissionInfo({ payload, callback }, { call }) {
      const res = yield call(permissionApi.getUserPermissionInfo, payload);
      if (callback) callback(res);
    },

    *updateUserPermission({ payload, callback }, { call }) {
      const res = yield call(permissionApi.updateUserPermission, payload);
      if (callback) callback(res);
    },

    *deleteUserPermission({ payload, callback }, { call }) {
      const res = yield call(permissionApi.deleteUserPermission, payload);
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

export default PermissionModel;
