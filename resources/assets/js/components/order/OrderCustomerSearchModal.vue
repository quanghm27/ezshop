<template>
    <modal v-model="active" effect="zoom" :large="true">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">Tìm khách hàng</h4>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                        <input class="form-control" v-model="keyword" @input="searchCustomer"
                               placeholder="Nhập tên hoặc số điện thoại (> 2 ký tự)...">
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-12">
                <p v-if="searchResult.length === 0">Không tìm thấy khách hàng nào</p>
                <div v-else class="list-group search-result">
                    <a v-for="result in searchResult" href="#"
                       @click.prevent="selectCustomer(result)"
                       @dblclick="save"
                       :class="{active: selected && result.id === selected.id}"
                       class="list-group-item list-group-item-action flex-column align-items-start">
                        <h5 class="mb-1">{{ result.name }}</h5>
                        <h5 class="mb-1">
                            <span class="badge badge-success">
                                <i class="fa fa-phone"></i> {{ result.phone_number }}
                            </span>
                            <span v-if="result.facebook_link" class="badge badge-primary">
                                <i class="fa fa-facebook"></i> {{ result.facebook_link }}
                            </span>
                        </h5>
                    </a>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click="hide">
                <i class="fa fa-times" aria-hidden="true"></i>Hủy
            </button>
            <button type="button" class="btn btn-success" @click="save">
                <i class="fa fa-check" aria-hidden="true"></i>Chọn
            </button>
        </div>
    </modal>
</template>

<script>
    import Vue from 'vue';
    import {mapGetters, mapActions} from 'vuex';

    import Modal from 'vue-strap/src/modal';

    export default {
        components: {Modal},
        computed: {
            ...mapGetters('orders', ['customer']),
            ...mapGetters('customers', {
                customers: 'all'
            }),
            active: {
                get() {
                    return this.$store.state.orders.customer.modal;
                },
                set(newValue) {
                    if (this.active && !newValue) {
                        this.hide();
                    }

                }
            },
        },
        methods: {
            ...mapActions('orders', ['hideCustomerModal', 'setCustomer']),
            hide() {
                this.keyword = '';
                this.searchResult = [];
                this.selected = null;
                this.hideCustomerModal();
            },
            save() {
                this.setCustomer(this.selected);
                this.hide();
            },
            searchCustomer() {
                if (this.keyword.length < 3) {
                    this.searchResult = [];
                } else {
                    this.searchResult = this.customers.filter(cus => {
                        let keyword = this.keyword.toLowerCase();
                        let customerName = this.convertTiengViet(cus.name);
                        return (customerName.toLowerCase().indexOf(keyword) > -1 ||
                            cus.phone_number.toLowerCase().indexOf(keyword) > -1);
                    });
                }
            },
            selectCustomer(customer) {
                this.selected = customer;
            },
            convertTiengViet(str) {
                str = str.toLowerCase();
                str = str.replace(/à|á|ạ|ả|ã|ầ|ấ|ậ|ẫ|â|ằ|ắ|ặ|ẳ|ẵ|ă/g, "a");
                str = str.replace(/è|é|ẹ|ẻ|ẽ|ề|ế|ệ|ể|ễ|ê/g, "e");
                str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                str = str.replace(/ò|ó|ọ|ỏ|õ|ồ|ố|ộ|ổ|ỗ|ô|ờ|ớ|ợ|ở|ỡ|ơ/g, "o");
                str = str.replace(/ù|ú|ụ|ủ|ũ|ừ|ứ|ự|ử|ữ|ư/g, "u");
                str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                str = str.replace(/đ/g, "d");

                return str;
            }
        },
        data() {
            return {
                keyword: '',
                searchResult: [],
                selected: null
            }
        }
    }
</script>