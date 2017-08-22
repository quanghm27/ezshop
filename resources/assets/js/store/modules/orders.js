import accounting from 'accounting';

import * as types from '../types';
import api from '../../utils/api';

const CUSTOMERS_API = '/api/customers';
const ORDERS_API = '/api/orders';
const PRODUCTS_API = '/api/products';

const state = {
    list: {
        loading: false,
        data: [],
        modal: false,
        dataOrder: []
    },
    detail: {
        valid: true,
        customer: null, // Backup purpose
        products: [] // Backup purpose
    },
    customer: {
        loading: false,
        data: null,
        modal: false
    },
    product: {
        loading: false,
        data: [],
        ids: [],
        modal: false
    }
};

const actions = {
    getAll({commit}) {
        api.get(ORDERS_API)
            .then(data => {
                commit(types.ORDERS_RECEIVED, data);
                commit(types.ORDERS_STOP_LOADING);
            })
            .catch(() => {
            });
    },
    searchOrderWithDate({commit}, {fromDate, toDate}) {
        commit(types.ORDERS_START_LOADING);
        api.get(ORDERS_API + "/" + fromDate + "/" + toDate + "/getWithDate")
            .then(data => {
                commit(types.ORDERS_SEARCH_DATE_RECEIVED, data);
                commit(types.ORDERS_STOP_LOADING);
            })
            .catch(() => {
            });
    },
    showCustomerModal({commit}) {
        commit(types.ORDERS_SHOW_CUSTOMER_MODAL);
    },
    hideCustomerModal({commit}) {
        commit(types.ORDERS_HIDE_CUSTOMER_MODAL);
    },
    getCustomer({commit}, id) {
        commit(types.ORDERS_CUSTOMER_START_LOADING);
        api.get(CUSTOMERS_API + '/' + id)
            .then(data => {
                commit(types.ORDERS_SET_CUSTOMER, data);
                commit(types.ORDERS_CUSTOMER_STOP_LOADING);
            })
            .catch(() => {
            });
    },
    setCustomer({commit}, customer) {
        commit(types.ORDERS_SET_CUSTOMER, customer);
    },
    // Product
    showProductModal({commit}) {
        commit(types.ORDERS_SHOW_PRODUCT_MODAL);
    },
    hideProductModal({commit}) {
        commit(types.ORDERS_HIDE_PRODUCT_MODAL);
    },
    getProduct({commit}, id) {
        commit(types.ORDERS_PRODUCT_START_LOADING);
        api.get(CUSTOMERS_API + '/' + id)
            .then(data => {
                commit(types.ORDERS_ADD_PRODUCT, data);
                commit(types.ORDERS_PRODUCT_STOP_LOADING);
            })
            .catch(() => {
            });
    },
    addProduct({commit}, product) {
        commit(types.ORDERS_ADD_PRODUCT, product);
    },
    removeProduct({commit}, product) {
        commit(types.ORDERS_REMOVE_PRODUCT, product);
    },
    setProducts({commit}, products) {
        commit(types.ORDERS_SET_PRODUCTS, products);
    },
    updateProduct({commit}, {product, key, value, modifiedFlg}) {
        commit(types.ORDERS_PRODUCT_UPDATE_PROPERTY, {product, key, value, modifiedFlg});
    },
    saveOrder({commit, state, dispatch}, totalPrice) {
        if (!state.customer.data || state.product.data.length === 0) return;
        let postData = {
            customer_id: state.customer.data.id,
            products: [],
            total_price: totalPrice
        };
        state.product.data.forEach(product => {
            let discount = product.discount_event > 0 ? product.discount_event : product.discount;
            postData.products.push({
                id: product.id,
                price: (1 - discount / 100) * product.price,
                discount: accounting.unformat(product.totalDiscount),
                quantity: product.sell
            });
        });
        api.post(ORDERS_API, postData)
            .then(data => {
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Thêm đơn hàng thành công!'
                }, {root: true});

                commit(types.ORDERS_CLEAR_OBJECT);

                //Re-get data of search product
                api.get(PRODUCTS_API)
                    .then(data => {
                        commit('products/' + types.PRODUCTS_RECEIVED_ORDERS, {
                            products: data
                        }, {root: true});
                    });
            });
    },
    // List
    showListModal({commit}) {
        commit(types.ORDERS_SHOW_LIST_MODAL);
    },
    hideListModal({commit}) {
        commit(types.ORDERS_HIDE_LIST_MODAL);
    },
    deleteOrder({commit}, order) {
        api.delete(ORDERS_API + '/' + order.id)
            .then(() => {
                commit(types.ORDERS_HIDE_LIST_MODAL);
                commit(types.ORDERS_REMOVE_ORDER, order);
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Xóa đơn hàng thành công!'
                }, {root: true});
            })
            .catch(errors => {
                commit(types.ORDERS_HIDE_LIST_MODAL);
                commit(types.ALERT_SHOW_FAILED, {
                    message: 'Không thể xóa đơn hàng',
                    errors
                }, {root: true});
            });
    },
    // Detail
    getOrderDetail({commit}, id) {
        commit(types.ORDERS_CUSTOMER_START_LOADING);
        commit(types.ORDERS_PRODUCT_START_LOADING);
        api.get(ORDERS_API + '/' + id)
            .then(data => {
                commit(types.ORDERS_DETAIL_SET_VALID);
                commit(types.ORDERS_SET_CUSTOMER, data.customer);
                commit(types.ORDERS_SET_PRODUCTS, data.products);
                commit(types.ORDERS_DETAIL_RECEIVED, data);
                commit(types.ORDERS_CUSTOMER_STOP_LOADING);
                commit(types.ORDERS_PRODUCT_STOP_LOADING);
            })
            .catch(() => {
                commit(types.ORDERS_DETAIL_SET_INVALID);
            });
    },
    updateOrder({commit, state}, id) {
        let req = {
            _method: 'patch',
            customer_id: state.customer.data.id,
            products: []
        };
        // Added or edited
        for (let product of state.product.data) {
            let discount = 0;
            if (product.isAdded) {
                // Only apply discount for newly added project
                discount = product.discount_event > 0 ? product.discount_event : product.discount;
            }
            req.products.push({
                id: product.id,
                price: (1 - discount / 100) * product.price,
                discount: accounting.unformat(product.totalDiscount),
                quantity: product.sell,
                changeQuantity: product.sell - product.sellOld
            });
        }

        // TODO: Send AJAX
        api.post(ORDERS_API + '/' + id, req)
            .then(() => {
                commit(types.ALERT_SHOW_SUCCEEDED, {
                    message: 'Sửa đơn hàng thành công!'
                }, {root: true});
            })
    }

};

const mutations = {
    [types.ORDERS_RECEIVED](state, data) {
        state.list.data = data;
    },
    [types.ORDERS_SEARCH_DATE_RECEIVED](state, data) {
        state.list.dataOrder = data;
    },
    [types.ORDERS_START_LOADING](state) {
        state.list.loading = true;
    },
    [types.ORDERS_STOP_LOADING](state) {
        state.list.loading = false;
    },
    [types.ORDERS_SHOW_CUSTOMER_MODAL](state) {
        state.customer.modal = true;
    },
    [types.ORDERS_HIDE_CUSTOMER_MODAL](state) {
        state.customer.modal = false;
    },
    [types.ORDERS_CUSTOMER_START_LOADING](state) {
        state.customer.loading = true;
    },
    [types.ORDERS_CUSTOMER_STOP_LOADING](state) {
        state.customer.loading = false;
    },
    [types.ORDERS_SET_CUSTOMER](state, customer) {
        state.customer.data = customer;
    },
    // Product
    [types.ORDERS_SHOW_PRODUCT_MODAL](state) {
        state.product.modal = true;
    },
    [types.ORDERS_HIDE_PRODUCT_MODAL](state) {
        state.product.modal = false;
    },
    [types.ORDERS_PRODUCT_START_LOADING](state) {
        state.product.loading = true;
    },
    [types.ORDERS_PRODUCT_STOP_LOADING](state) {
        state.product.loading = false;
    },
    [types.ORDERS_ADD_PRODUCT](state, product) {
        let orderProduct = Object.assign({}, product);
        orderProduct.isAdded = true;
        orderProduct.sell = 1;
        orderProduct.totalDiscount = 0;
        if (orderProduct.discount_event > 0) {
            orderProduct.total = product.price * (1 - product.discount_event / 100);
        } else {
            orderProduct.total = product.price * (1 - product.discount / 100);
        }

        state.product.data.push(orderProduct);
        state.product.ids.push(orderProduct.id);
    },
    [types.ORDERS_REMOVE_PRODUCT](state, product) {
        let idx = state.product.data.indexOf(product);
        state.product.data.splice(idx, 1);
        state.product.ids.splice(idx, 1);
    },
    [types.ORDERS_SET_PRODUCTS](state, products) {
        state.product.data = products;
        state.product.ids = [];
        products.forEach(p => {
            state.product.ids.push(p.id);
        });
    },
    [types.ORDERS_PRODUCT_UPDATE_PROPERTY](state, {product, key, value, modifiedFlg}) {
        product[key] = value;
        let totalDiscount = accounting.unformat(product.totalDiscount);
        if (product.discount_event > 0) {
            product.total = (1 - product.discount_event / 100) * product.price * product.sell - totalDiscount;
        } else {
            product.total = (1 - product.discount / 100) * product.price * product.sell - totalDiscount;
        }
        if (product.total < 0)
            product.total = 0;
        if (modifiedFlg) {
            product.quantity = product.quantityOld + product.sellOld - product.sell;
        }
    },
    // List
    [types.ORDERS_SHOW_LIST_MODAL](state) {
        state.list.modal = true;
    },
    [types.ORDERS_HIDE_LIST_MODAL](state) {
        state.list.modal = false;
    },
    [types.ORDERS_REMOVE_ORDER](state, order) {
        let idx = state.list.data.indexOf(order);
        state.list.data.splice(idx, 1);
    },
    // Detail
    [types.ORDERS_DETAIL_SET_VALID](state) {
        state.detail.valid = true;
    },
    [types.ORDERS_DETAIL_SET_INVALID](state) {
        state.detail.valid = false;
    },
    [types.ORDERS_DETAIL_RECEIVED](state, data) {
        state.detail.customer = data.customer;
        state.detail.products = [];
        for (let product of data.products) {
            state.detail.products.push(Object.assign({}, product));
        }
    },
    [types.ORDERS_CLEAR_OBJECT](state) {
        state.product.data = [];
        state.product.ids = [];
    }
};

const getters = {
    orderLoading: state => state.list.loading,
    orders: state => state.list.data,
    dataOrder: state => state.list.dataOrder,
    customerLoading: state => state.customer.loading,
    customer: state => state.customer.data,
    productLoading: state => state.product.loading,
    products: state => state.product.data,
    productIds: state => state.product.ids,
    // Detail
    detailValid: state => state.detail.valid,
    detailCustomer: state => state.detail.customer,
    detailProducts: state => state.detail.products
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};