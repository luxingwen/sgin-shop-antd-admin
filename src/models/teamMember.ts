import type { Effect, Reducer, Subscription } from '@umijs/max';
import { teamService } from '@/services/team';

export interface TeamMemberState {
  list: any[];
  total: number;
  loading: boolean;
}

export interface TeamMemberModelType {
  namespace: 'teamMember';
  state: TeamMemberState;
  effects: {
    fetchList: Effect;
    add: Effect;
    remove: Effect;
  };
  reducers: {
    setLoading: Reducer<TeamMemberState>;
    save: Reducer<TeamMemberState>;
  };
  subscriptions: { setup: Subscription };
}

const TeamMemberModel: TeamMemberModelType = {
  namespace: 'teamMember',

  state: {
    list: [],
    total: 0,
    loading: false,
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield call(teamService.getTeamMembers, payload);
        if (callback) callback(res);
        yield put({ type: 'save', payload: { list: res?.data?.data || [], total: res?.data?.total || 0 } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *add({ payload, callback }, { call }) {
      const res = yield call(teamService.addTeamMember, payload);
      if (callback) callback(res);
    },

    *remove({ payload, callback }, { call }) {
      const res = yield call(teamService.deleteTeamMember, payload);
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

export default TeamMemberModel;
