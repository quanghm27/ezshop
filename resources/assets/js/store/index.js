import Vue from 'vue';
import Vuex from 'vuex';

import * as types from './types';
import products from './modules/products';
import customers from './modules/customers';
import orders from './modules/orders';
import events from './modules/events';

Vue.use(Vuex);

const state = {
    alert: {
        active: false,
        type: '',
        title: '',
        message: '',
        errors: []
    }
};

const actions = {
    alertSucceeded({commit}, message) {
        commit(types.ALERT_SHOW_SUCCEEDED, {message});
    },
    alertFailed({commit}, {message, errors}) {
        commit(types.ALERT_SHOW_FAILED, {message, errors});
    },
    alertHide({commit}) {
        commit(types.ALERT_HIDE);
    }
};

const mutations = {
    [types.ALERT_SHOW_SUCCEEDED](state, {message}) {
        state.alert.type = 'success';
        state.alert.title = 'Thành công';
        state.alert.message = message;
        state.alert.errors = [];
        state.alert.active = true;
    },
    [types.ALERT_SHOW_FAILED](state, {message, errors}) {
        state.alert.type = 'danger';
        state.alert.title = 'Lỗi';
        state.alert.message = message;
        state.alert.errors = errors;
        state.alert.active = true;
    },
    [types.ALERT_HIDE](state) {
        state.alert.active = false;
    }
};

const getters = {
    alertType: state => state.alert.type,
    alertTitle: state => state.alert.title,
    alertMessage: state => state.alert.message,
    alertErrors: state => state.alert.errors
};

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules: {
        products, customers, orders, events
    },
    strict: process.env.NODE_ENV !== 'production'
})