import type { Effect, Reducer } from '@umijs/max';
import { configApi } from '@/services/system/config';

export interface ConfigState {
  site?: any;
  email?: any;
  loading?: boolean;
}

const ConfigModel = {
  namespace: 'config',
  state: {
    site: {},
    email: {},
    loading: false,
  },
  effects: {
    *getSiteConfig({ payload, callback }: any, { call }: any) {
      const res = yield call(configApi.getSiteConfig, payload);
      if (callback) callback(res);
    },
    *updateSiteConfig({ payload, callback }: any, { call }: any) {
      const res = yield call(configApi.updateSiteConfig, payload);
      if (callback) callback(res);
    },
    *getEmailConfig({ payload, callback }: any, { call }: any) {
      const res = yield call(configApi.getEmailConfig, payload);
      if (callback) callback(res);
    },
    *updateEmailConfig({ payload, callback }: any, { call }: any) {
      const res = yield call(configApi.updateEmailConfig, payload);
      if (callback) callback(res);
    },
  },
  reducers: {
    setLoading(state: any, { payload }: any) {
      state.loading = payload;
    },
    saveSite(state: any, { payload }: any) {
      state.site = payload;
    },
    saveEmail(state: any, { payload }: any) {
      state.email = payload;
    },
  },
};

export default ConfigModel;
