import type { Effect, Reducer, Subscription } from '@umijs/max';
import { teamService } from '@/services/team';

export interface TeamState {
  list: any[];
  total: number;
  loading: boolean;
}

export interface TeamModelType {
  namespace: 'team';
  state: TeamState;
  effects: {
    fetchList: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    setLoading: Reducer<TeamState>;
    save: Reducer<TeamState>;
  };
  subscriptions: { setup: Subscription };
}

const TeamModel: TeamModelType = {
  namespace: 'team',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(teamService.getTeams, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *add({ payload, callback }, { call }) {
      const res = yield call(teamService.addTeam, payload);
      if (callback) callback(res);
    },

    *update({ payload, callback }, { call }) {
      const res = yield call(teamService.updateTeam, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call }) {
      const res = yield call(teamService.deleteTeam, payload);
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

export default TeamModel;
