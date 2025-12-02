import type { Effect, Reducer } from '@umijs/max';
import { pageService } from '@/services/page/page';

export interface PageState {
  list: any[];
  total: number;
  loading: boolean;
}

const PageModel = {
  namespace: 'page',
  state: { list: [], total: 0, loading: false },
  effects: {
    *getList({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(pageService.getPages, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *remove({ payload, callback }: any, { call }: any) {
      const res = yield call(pageService.deletePage, payload);
      if (callback) callback(res);
    },
    *getPage({ payload, callback }: any, { call }: any) {
      const res = yield call(pageService.getPage, payload);
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

export default PageModel;
