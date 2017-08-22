<template>
    <div class="sidebar">
        <nav class="sidebar-nav">
            <ul class="nav">
                <li class="nav-item">
                    <router-link :to="{ name: 'Home' }" class="nav-link" exact>
                        <i class="fa fa-home" aria-hidden="true"></i> Trang chủ
                    </router-link>
                </li>
                <li class="nav-title">
                    Sản phẩm
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'Product' }" class="nav-link" exact>
                        <i class="fa fa-truck" aria-hidden="true"></i> Quản lý sản phẩm
                    </router-link>
                    <router-link :to="{ name: 'DiscountEvent' }" class="nav-link" exact>
                        <i class="fa fa-rocket" aria-hidden="true"></i> Sự kiện giảm giá
                    </router-link>
                    <router-link :to="{ name: 'Customer' }" class="nav-link" exact>
                        <i class="fa fa-user" aria-hidden="true"></i> Quản lý khách hàng
                    </router-link>
                </li>
                <li class="nav-title">
                    Hóa đơn/Đơn hàng
                </li>
                <router-link tag="li" class="nav-item nav-dropdown" :to="{ path: '/orders'}" disabled>
                    <div class="nav-link nav-dropdown-toggle" @click="handleClick">
                        <i class="fa fa-shopping-bag" aria-hidden="true"></i> Quản lý đơn hàng
                    </div>
                    <ul class="nav-dropdown-items">
                        <li class="nav-item">
                            <router-link :to="{ name: 'OrderList' }" class="nav-link" exact><i class="fa fa-plus"></i> Danh sách</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :to="{ name: 'OrderCreate' }" class="nav-link" exact><i class="fa fa-plus"></i> Tạo đơn hàng</router-link>
                        </li>
                    </ul>
                </router-link>
                <li class="nav-title">
                    Doanh thu
                </li>
                <li class="nav-item">
                    <router-link :to="{ name: 'SaleStatistics' }" class="nav-link" exact><i class="fa fa-money"></i> Thống kê doanh thu</router-link>                    
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>

    export default {
        name: 'sidebar',
        methods: {
            handleClick (e) {
                e.preventDefault();
                e.target.parentElement.classList.toggle('open')
            }
        }
    }
</script>

<style lang="css">
    .nav-link {
        cursor: pointer;
    }
</style>
