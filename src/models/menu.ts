import type { Effect, Reducer, Subscription } from '@umijs/max';
import { menuApi } from '@/services/system/menu';

export interface MenuState {
  list: any[];
  loading: boolean;
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuState;
  effects: {
    fetchMenus: Effect;
    addMenu: Effect;
    updateMenu: Effect;
    deleteMenu: Effect;
    getMenuInfo: Effect;
    getMenuAPIs: Effect;
    addMenuAPI: Effect;
  };
  reducers: {
    setLoading: Reducer<MenuState>;
    save: Reducer<MenuState>;
  };
  subscriptions: { setup: Subscription };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetchMenus({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(menuApi.getMenus, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [] } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *addMenu({ payload, callback }, { call }) {
      const res = yield call(menuApi.addMenu, payload);
      if (callback) callback(res);
    },

    *updateMenu({ payload, callback }, { call }) {
      const res = yield call(menuApi.updateMenu, payload);
      if (callback) callback(res);
    },

    *deleteMenu({ payload, callback }, { call }) {
      const res = yield call(menuApi.deleteMenu, payload);
      if (callback) callback(res);
    },

    *getMenuInfo({ payload, callback }, { call }) {
      const res = yield call(menuApi.getMenuInfo, payload);
      if (callback) callback(res);
    },

    *getMenuAPIs({ payload, callback }, { call }) {
      const res = yield call(menuApi.getMenuAPIs, payload);
      if (callback) callback(res);
    },

    *addMenuAPI({ payload, callback }, { call }) {
      const res = yield call(menuApi.addMenuAPI, payload);
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

export default MenuModel;
