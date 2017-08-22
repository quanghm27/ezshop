import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/home/Home.vue';
import Product from '../components/product/Product.vue';
import Customer from '../components/customer/Customer.vue';
import OrderList from '../components/order/OrderList.vue';
import OrderCreate from '../components/order/OrderCreate.vue';
import OrderDetail from '../components/order/OrderDetail.vue';
import DiscountEvent from '../components/event/DiscountEvent.vue';
import SaleStatistics from '../components/statistic/SaleStatistics.vue';

Vue.use(Router);

const router = new Router({
    linkActiveClass: 'open active',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/products',
            name: 'Product',
            component: Product
        },
        {
            path: '/customers',
            name: 'Customer',
            component: Customer
        },
        {
            path: '/orders/',
            name: 'OrderList',
            component: OrderList
        },
        {
            path: '/orders/create',
            name: 'OrderCreate',
            component: OrderCreate
        },
        {
            path: '/orders/:id',
            name: 'OrderDetail',
            component: OrderDetail
        },
        {
            path: '/event',
            name: 'DiscountEvent',
            component: DiscountEvent
        },
        {
            path: '/statistics',
            name: 'SaleStatistics',
            component: SaleStatistics
        }
    ]
});

export default router;