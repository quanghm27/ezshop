import Vue from 'vue';
import * as types from '../types';
import api from '../../utils/api';
import * as moment from 'moment';

const PRODUCTS_API = '/api/products';

const state = {
    list: {
        loading: true,
        data: [],
        currentCustomer: null,
        dataEvent: []
    },
    modal: {
        active: false,
        type: '',
        product: {}
    },
    detail: {
        orders: [],
        loading: true
    }
};

const actions = {
    getAll({commit}, callback) {
        commit(types.PRODUCTS_START_LOADING);
        api.get(PRODUCTS_API)
            .then(data => {
                commit(types.PRODUCTS_STOP_LOADING);
                commit(types.PRODUCTS_RECEIVED, data);
                if (typeof(callback) === 'function') callback(data);
            })
            .catch(data => {
            });
    },
    getAllEvent({commit}) {
        commit(types.PRODUCTS_START_LOADING);
        api.get('/api/productsInEvent')
            .then(data => {
                commit(types.PRODUCTS_STOP_LOADING);
                commit(types.PRODUCTS_RECEIVED_EVENTS, data);
            })
            .catch(data => {
            });
    },
    setCurrentCustomer({commit}, product) {
        commit(types.PRODUCTS_SET_CURRENT, product);
    },
    showAddModal({commit}) {
        let emptyProduct = {
            code: '',
            name: '',
            quantity: '',
            price: '',
            discount: 0,
            description: '',
            image: ''
        };
        commit(types.PRODUCTS_SHOW_MODAL, {
            type: 'add',
            product: emptyProduct
        });
    },
    showEditModal({commit}, product) {
        commit(types.PRODUCTS_SET_CURRENT, product);
        commit(types.PRODUCTS_SHOW_MODAL, {
            type: 'edit',
            product: Object.assign({}, product)
        });
    },
    showDeleteModal({commit}, product) {
        commit(types.PRODUCTS_SET_CURRENT, product);
        commit(types.PRODUCTS_SHOW_MODAL, {
            type: 'delete',
            product: product
        });
    },
    showUpdateQuantityModal({commit}, product) {
        commit(types.PRODUCTS_SET_CURRENT, product);
        commit(types.PRODUCTS_SHOW_MODAL, {
            type: 'updateQuantity',
            product: product
        });
    },
    showProductOrderModal({commit}, product) {
        commit(types.PRODUCTS_ORDERS_START_LOADING);
        commit(types.PRODUCTS_SET_CURRENT, product);
        commit(types.PRODUCTS_SHOW_MODAL, {
            type: 'productOrder',
            product: product
        });
        api.get(PRODUCTS_API + '/' + product.id)
            .then(data => {
                commit(types.PRODUCTS_SET_ORDERS, data);
            })
            .catch(() => {
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể hiển thị sản phẩm',
                    errors
                }, {root: true});
            });
            commit(types.PRODUCTS_ORDERS_STOP_LOADING);
    },
    hideModal({commit}) {
        commit(types.PRODUCTS_HIDE_MODAL);
    },
    updateProduct({commit}, {key, value}) {
        commit(types.PRODUCTS_UPDATE_MODAL, {key, value});
    },
    add({commit}, {formData}) {
        api.post(PRODUCTS_API, formData)
            .then(data => {
                commit(types.PRODUCTS_ADD, data);
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Thêm sản phẩm thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể thêm sản phẩm',
                    errors
                }, {root: true});
            });
    },
    edit({commit}, {id, formData}) {
        api.post(PRODUCTS_API + '/' + id, formData)
            .then(data => {
                commit(types.PRODUCTS_EDIT, data);
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Sửa sản phẩm thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể sửa sản phẩm',
                    errors
                }, {root: true});
            });
    },
    delete({commit}, {product}) {
        api.delete(PRODUCTS_API + '/' + product.id)
            .then(() => {
                commit(types.PRODUCTS_DELETE, product);
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Xóa sản phẩm thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể xóa sản phẩm',
                    errors
                }, {root: true});
            });
    },
    updateQuantity({commit}, {id, quantity}) {
        let req = {
            _method: 'patch',
            quantity: quantity
        };
        api.post(PRODUCTS_API + '/' + id + '/quantity', req)
            .then(data => {
                commit(types.PRODUCTS_EDIT, data);
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Cập nhật số lượng thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể cập nhật số lượng',
                    errors
                }, {root: true});
            });
    },
    sortProduct({commit}, {name, reverse}) {
        commit(types.PRODUCTS_RECEIVED_SORT, {name, reverse});
    },
    // Detail
    getProductOrder({commit}, id) {
        api.get(PRODUCTS_API + '/' + id)
            .then(data => {
                commit(types.PRODUCTS_SET_ORDERS, data);
            })
            .catch(() => {
                commit(types.PRODUCTS_HIDE_MODAL);
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể hiển thị sản phẩm',
                    errors
                }, {root: true});
            });
    }
};

const mutations = {
    [types.PRODUCTS_START_LOADING](state) {
        state.list.loading = true;
    },
    [types.PRODUCTS_STOP_LOADING](state) {
        state.list.loading = false;
    },
    [types.PRODUCTS_RECEIVED](state, products) {
        state.list.data = products;
    },
    [types.PRODUCTS_RECEIVED_ORDERS](state, {products}) {
        state.list.data = products;
    },
    [types.PRODUCTS_RECEIVED_SORT](state, param) {
        var filterA, filterB;
        return state.list.data.sort(function (a, b) {
            switch (param.name) {
                case 'id':
                    filterA = a.id;
                    filterB = b.id;
                    break;
                case 'name':
                    filterA = a.name;
                    filterB = b.name;
                    break;
                case 'quantity':
                    filterA = a.quantity;
                    filterB = b.quantity;
                    break;
                case 'price':
                    if (a.discount_event > 0) {
                        filterA = a.price * (1 - a.discount_event / 100);
                    }
                    if (b.discount_event > 0) {
                        filterB = b.price * (1 - b.discount_event / 100);
                    }
                    if (a.discount > 0) {
                        filterA = a.price * (1 - a.discount / 100);
                    }
                    if (b.discount > 0) {
                        filterB = b.price * (1 - b.discount / 100);
                    }
                    if (a.discount == 0 && a.discount_event == 0) {
                        filterA = a.price;
                    }
                    if (b.discount == 0 && b.discount_event == 0) {
                        filterB = b.price;
                    }
                    break;
            }
            if (param.reverse) {
                return (filterA > filterB) ? 1 : -1;
            } else {
                return (filterA < filterB) ? 1 : -1;
            }
        });
    },
    [types.PRODUCTS_SET_CURRENT](state, product) {
        state.list.currentCustomer = product;
    },
    [types.PRODUCTS_SHOW_MODAL](state, {type, product}) {
        state.modal.type = type;
        state.modal.product = product;
        state.modal.active = true;
    },
    [types.PRODUCTS_HIDE_MODAL](state) {
        state.modal.active = false;
    },
    [types.PRODUCTS_UPDATE_MODAL](state, {key, value}) {
        Vue.set(state.modal.product, key, value);
    },
    [types.PRODUCTS_ADD](state, product) {
        state.list.data.push(product);
    },
    [types.PRODUCTS_EDIT](state, product) {
        Object.assign(state.list.currentCustomer, product);
    },
    [types.PRODUCTS_DELETE](state, product) {
        let idx = state.list.data.indexOf(product);
        state.list.data.splice(idx, 1);
    },
    [types.PRODUCTS_RECEIVED_EVENTS](state, products) {
        state.list.dataEvent = products;
    },
    [types.PRODUCTS_SET_ORDERS](state, data) {
        state.detail.orders = data.sort(function (a, b) {

           return moment.utc(b.dateCreated.date).diff(moment.utc(a.dateCreated.date));
        });
    },
    [types.PRODUCTS_ORDERS_START_LOADING](state) {
        state.detail.loading = true;
    },
    [types.PRODUCTS_ORDERS_STOP_LOADING](state) {
        state.detail.loading = false;
    }
};

const getters = {
    loading: state => state.list.loading,
    all: state => state.list.data,
    allEvent: state => state.list.dataEvent,
    modalActive: state => state.modal.active,
    modalType: state => state.modal.type,
    modalProduct: state => state.modal.product,
    orderDetail: state => state.detail.orders,
    orderLoading: state => state.detail.loading
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};