import type { Effect, Reducer } from '@umijs/max';
import { orderServices } from '@/services/order';

export interface OrderState {
  list: any[];
  total: number;
  loading: boolean;
}

const OrderModel = {
  namespace: 'order',
  state: { list: [], total: 0, loading: false },
  effects: {
    *getList({ payload, callback }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(orderServices.getOrders, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *remove({ payload, callback }: any, { call }: any) {
      const res = yield call(orderServices.deleteOrder, payload);
      if (callback) callback(res);
    },

    *getOrderItems({ payload, callback }: any, { call }: any) {
      const res = yield call(orderServices.getOrderItemList, payload);
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

export default OrderModel;
