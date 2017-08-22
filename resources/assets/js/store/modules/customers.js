import Vue from 'vue';
import * as types from '../types';
import api from '../../utils/api';
import * as moment from 'moment';

const CUSTOMERS_API = '/api/customers';

const state = {
    list: {
        loading: true,
        data: [],
        currentCustomer: null
    },
    modal: {
        active: false,
        type: '',
        customer: {}
    },
    detail: {
        orders: [],
        loading: true
    }
};

const actions = {
    getAll({commit}) {
        commit(types.CUSTOMERS_START_LOADING);
        api.get(CUSTOMERS_API)
            .then(data => {
                commit(types.CUSTOMERS_STOP_LOADING);
                commit(types.CUSTOMERS_RECEIVED, data);
            })
            .catch(data => {
            });
    },
    setCurrentCustomer({commit}, customer) {
        commit(types.CUSTOMERS_SET_CURRENT, customer);
    },
    showAddModal({commit}) {
        let emptyCustomer = {
            name: '',
            phone_number: '',
            email: '',
            facebook_link: '',
            address: '',
            note: ''
        };
        commit(types.CUSTOMERS_SHOW_MODAL, {
            type: 'add',
            customer: emptyCustomer
        });
    },
    showCustomerOrderModal({commit}, customer) {
        commit(types.CUSTOMERS_ORDERS_START_LOADING);
        commit(types.CUSTOMERS_SHOW_MODAL, {
            type: 'customerOrder',
            customer: customer
        });
        api.get(CUSTOMERS_API + '/findOrder/' + customer.id)
        .then(data => {
            commit(types.CUSTOMERS_ORDER_DETAILS, data);
        })
        .catch(() => {
            commit(types.CUSTOMERS_HIDE_MODAL);
            commit(types.ALERT_SHOW_FAILED, {
                message: 'Không thể hiển thị khách hàng',
                errors
            }, {root: true});
        });
        commit(types.CUSTOMERS_ORDERS_STOP_LOADING);
    },
    showEditModal({commit}, customer) {
        commit(types.CUSTOMERS_SET_CURRENT, customer);
        commit(types.CUSTOMERS_SHOW_MODAL, {
            type: 'edit',
            customer: Object.assign({}, customer)
        });
    },
    showDeleteModal({commit}, customer) {
        commit(types.CUSTOMERS_SET_CURRENT, customer);
        commit(types.CUSTOMERS_SHOW_MODAL, {
            type: 'delete',
            customer: customer
        });
    },
    hideModal({commit}) {
        commit(types.CUSTOMERS_HIDE_MODAL);
    },
    updateCustomer({commit}, {key, value}) {
        commit(types.CUSTOMERS_UPDATE_MODAL, {key, value});
    },
    add({commit, state}, {callback}) {
        api.post(CUSTOMERS_API, state.modal.customer)
            .then(data => {
                commit(types.CUSTOMERS_ADD, data);
                commit(types.CUSTOMERS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Thêm khách hàng thành công!'
                }, {root: true});
                if (typeof(callback) === 'function') callback(data);
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể thêm khách hàng',
                    errors
                }, {root: true});
            });
    },
    edit({commit, state}) {
        let req = Object.assign({}, state.modal.customer);
        req._method = 'patch';
        api.post(CUSTOMERS_API + '/' + req.id, req)
            .then(data => {
                commit(types.CUSTOMERS_EDIT, data);
                commit(types.CUSTOMERS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Sửa khách hàng thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể sửa khách hàng',
                    errors
                }, {root: true});
            });
    },
    delete({commit, state}) {
        api.delete(CUSTOMERS_API + '/' + state.list.currentCustomer.id)
            .then(() => {
                commit(types.CUSTOMERS_DELETE, state.list.currentCustomer);
                commit(types.CUSTOMERS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Xóa khách hàng thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.CUSTOMERS_HIDE_MODAL);
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể xóa khách hàng',
                    errors
                }, {root: true});
            });
    }
};

const mutations = {
    [types.CUSTOMERS_START_LOADING](state) {
        state.list.loading = true;
    },
    [types.CUSTOMERS_STOP_LOADING](state) {
        state.list.loading = false;
    },
    [types.CUSTOMERS_RECEIVED](state, customers) {
        state.list.data = customers
    },
    [types.CUSTOMERS_SET_CURRENT](state, customer) {
        state.list.currentCustomer = customer;
    },
    [types.CUSTOMERS_SHOW_MODAL](state, {type, customer}) {
        state.modal.type = type;
        state.modal.customer = customer;
        state.modal.active = true;
    },
    [types.CUSTOMERS_HIDE_MODAL](state) {
        state.modal.active = false;
    },
    [types.CUSTOMERS_UPDATE_MODAL](state, {key, value}) {
        Vue.set(state.modal.customer, key, value);
    },
    [types.CUSTOMERS_ADD](state, customer) {
        state.list.data.push(customer);
    },
    [types.CUSTOMERS_EDIT](state, customer) {
        Object.assign(state.list.currentCustomer, customer);
    },
    [types.CUSTOMERS_DELETE](state, customer) {
        let idx = state.list.data.indexOf(customer);
        state.list.data.splice(idx, 1);
    },
    [types.CUSTOMERS_ORDER_DETAILS](state, data) {
        state.detail.orders = data.sort(function (a, b) {

           return moment.utc(b.dateCreated.date).diff(moment.utc(a.dateCreated.date));
        });
    },
    [types.CUSTOMERS_ORDERS_START_LOADING](state) {
        state.detail.loading = true;
    },
    [types.CUSTOMERS_ORDERS_STOP_LOADING](state) {
        state.detail.loading = false;
    }
};

const getters = {
    loading: state => state.list.loading,
    all: state => state.list.data,
    modalActive: state => state.modal.active,
    modalType: state => state.modal.type,
    modalCustomer: state => state.modal.customer,
    cusOrderDetail: state => state.detail.orders,
    orderLoading: state => state.detail.loading
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};