import * as types from '../types';
import api from '../../utils/api';

const CUSTOMERS_API = '/api/customers';
const PRODUCTS_API = '/api/products';
const state = {
    productEvent: {
        data: [],
        ids: {}
    },
    modal: {
        active: false
    }
};

const actions = {
    // Product
    setProduct({commit}, product) {
        let errors = [];
        if (product === null) {
            commit(types.ALERT_SHOW_FAILED, {
                message: 'Sản phẩm chưa được chọn !',
                errors
            }, {root: true});
        } else if (product.discountNew === '') {
            commit(types.ALERT_SHOW_FAILED, {
                message: '% khuyến mãi chưa được nhập!',
                errors
            }, {root: true});
        } else {
            commit(types.EVENTS_SET_PRODUCT, product);
        }
    },
    updateDiscountEvent({commit, dispatch}) {
        let req = {
            _method: 'patch',
            products: state.productEvent.ids
        };
        api.post(PRODUCTS_API + '/event', req)
            .then(data => {
                dispatch('products/getAll', () => {
                    commit(types.EVENTS_UPDATE_DISCOUNT);
                    commit('products/' + types.PRODUCTS_RECEIVED_EVENTS, data, {root: true});
                    commit(types.ALERT_SHOW_SUCCEEDED, {
                        message: 'Cập nhật số lượng thành công!'
                    }, {root: true});
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể cập nhật số lượng',
                    errors
                }, {root: true});
            });
    },
    closeDiscountEvent({dispatch, commit}) {
        let req = {
            _method: 'patch'
        };
        api.post(PRODUCTS_API + '/closeEvent', req)
            .then(() => {
                dispatch('products/getAll', () => {
                    commit(types.EVENTS_UPDATE_DISCOUNT);
                    commit('products/' + types.PRODUCTS_RECEIVED_EVENTS, [], {root: true});
                    commit(types.ALERT_SHOW_SUCCEEDED, {
                        message: 'Đã kết thúc sự kiện khuyến mãi!'
                    }, {root: true});
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể kết thúc sự kiện khuyến mãi!',
                    errors
                }, {root: true});
            });
        commit(types.EVENTS_HIDE_MODAL);
    },
    closeDiscountProduct({commit, dispatch}, id) {
        let req = {
            _method: 'patch'
        };
        api.post(PRODUCTS_API + '/' + id + '/closeDiscountProduct', req)
            .then(data => {
                dispatch('products/getAll', () => {
                    commit(types.EVENTS_UPDATE_DISCOUNT);
                    commit('products/' + types.PRODUCTS_RECEIVED_EVENTS, data, {root: true});
                    commit(types.ALERT_SHOW_SUCCEEDED, {
                        message: 'Đã kết thúc khuyến mãi cho sản phẩm này.'
                    }, {root: true});
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể kết thúc khuyến mãi cho sản phẩm này',
                    errors
                }, {root: true});
            });
    },
    removeProduct({commit}, product) {
        commit(types.EVENTS_REMOVE_PRODUCT, product);
    },
    hideModal({commit}) {
        commit(types.EVENTS_HIDE_MODAL);
    },
    showModal({commit}) {
        commit(types.EVENTS_SHOW_MODAL);
    }
};

const mutations = {
    // Product
    [types.EVENTS_SET_PRODUCT](state, product) {
        product.total = (1 - product.discountNew / 100) * product.price;
        state.productEvent.data.push(product);
        state.productEvent.ids[product.id] = product.discountNew;
    },
    [types.EVENTS_UPDATE_DISCOUNT](state) {
        state.productEvent.data = [];
        state.productEvent.ids = {};
    },
    [types.EVENTS_REMOVE_PRODUCT](state, product) {
        let idx = state.productEvent.data.indexOf(product);
        state.productEvent.data.splice(idx, 1);
        delete state.productEvent.ids[product.id];
    },
    [types.EVENTS_HIDE_MODAL](state) {
        state.modal.active = false;
    },
    [types.EVENTS_SHOW_MODAL](state) {
        state.modal.active = true;
    }
};

const getters = {
    products: state => state.productEvent.data,
    productIds: state => state.productEvent.ids
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};