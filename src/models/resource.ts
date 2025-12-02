import type { Effect, Reducer, Subscription } from '@umijs/max';
import { resourceApi } from '@/services/system/resource';
import type { Resource } from '@/services/types';

export interface ResourceState {
  list: Resource[];
  total: number;
  loading: boolean;
  query: Record<string, any>;
}

export interface ResourceModelType {
  namespace: 'resource';
  state: ResourceState;
  effects: {
    getList: Effect;
    createResource: Effect;
    updateResource: Effect;
    deleteResource: Effect;
    createFolder: Effect;
    getFolderList: Effect;
    moveResource: Effect;
  };
  reducers: {
    setLoading: Reducer<ResourceState>;
    save: Reducer<ResourceState>;
  };
  subscriptions: { setup: Subscription };
}

const ResourceModel: ResourceModelType = {
  namespace: 'resource',

  state: {
    list: [],
    total: 0,
    loading: false,
    query: {},
  },

  effects: {
    *getList({ payload, callback }, { call, put, select }) {
      const query = payload || (yield select((s: any) => s.resource.query));
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(resourceApi.getResourceList, query);
        yield put({ type: 'save', payload: { list: res.data || [], total: res.data?.total || 0, query } });
        if (callback) callback(res);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *createResource({ payload, callback }, { call }) {
      const res = yield call(resourceApi.createResource, payload);
      if (callback) callback(res);
    },

    *updateResource({ payload, callback }, { call }) {
      const res = yield call(resourceApi.updateResource, payload);
      if (callback) callback(res);
    },

    *deleteResource({ payload, callback }, { call }) {
      const res = yield call(resourceApi.deleteResource, payload);
      if (callback) callback(res);
    },

    *createFolder({ payload, callback }, { call }) {
      const res = yield call(resourceApi.createFolder, payload);
      if (callback) callback(res);
    },

    *getFolderList({ payload, callback }, { call }) {
      const res = yield call(resourceApi.getFolderList, payload);
      if (callback) callback(res);
    },

    *moveResource({ payload, callback }, { call }) {
      const res = yield call(resourceApi.moveResource, payload);
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
      state.query = payload.query || state.query;
    },
  },

  subscriptions: {
    setup() {},
  },
};

export default ResourceModel;
