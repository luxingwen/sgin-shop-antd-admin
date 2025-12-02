import type { Effect, Reducer, Subscription } from '@umijs/max';
import { paymentApi } from '@/services/system/payment';

export interface PaymentState {
  list: any[];
  total: number;
  loading: boolean;
}

export interface PaymentModelType {
  namespace: 'payment';
  state: PaymentState;
  effects: {
    getList: Effect;
    updateStatus: Effect;
    fetchClientId: Effect;
    requestPayPal: Effect;
    getPaymentInfo: Effect;
    updatePaymentConfig: Effect;
    updateAlipayConfig: Effect;
  };
  reducers: {
    setLoading: Reducer<PaymentState>;
    save: Reducer<PaymentState>;
  };
  subscriptions: { setup: Subscription };
}

const PaymentModel: PaymentModelType = {
  namespace: 'payment',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(paymentApi.getPaymentMethodList, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *getPaymentInfo({ payload, callback }, { call }) {
      const res = yield call(paymentApi.getPaymentMethodInfo, payload);
      if (callback) callback(res);
    },

    *updatePaymentConfig({ payload, callback }, { call }) {
      const res = yield call(paymentApi.updatePaymentMethodConfig, payload);
      if (callback) callback(res);
    },

    *updateAlipayConfig({ payload, callback }, { call }) {
      const res = yield call(paymentApi.updateAlipayConfig, payload);
      if (callback) callback(res);
    },

    *updateStatus({ payload, callback }, { call }) {
      const res = yield call(paymentApi.updatePaymentMethodStatus, payload);
      if (callback) callback(res);
    },

    *fetchClientId({ payload, callback }, { call }) {
      const res = yield call(paymentApi.fetchPayPalClientId, payload);
      if (callback) callback(res);
    },

    *requestPayPal({ payload, callback }, { call }) {
      const res = yield call(paymentApi.requestPayPalPayment, payload);
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

export default PaymentModel;
