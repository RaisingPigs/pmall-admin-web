<template>
    <div>
        <el-row>
            <el-col>
                <Breadcrumb :breadcrumb-list="breadcrumbList"></Breadcrumb>
            </el-col>
        </el-row>

        <el-row>
            <el-col>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>订单列表</span>
                    </div>

                    <!--搜索框-->
                    <el-row :gutter='15'>
                        <el-col :span='10'>
                            <!--@clear事件, 当点击清空键清空文本框时触发-->
                            <el-input
                                placeholder='请输入内容'
                                v-model='queryInfo.query'
                                @keyup.enter.native='listOrders'
                                @clear='clearSearch'
                                clearable>
                                <el-button
                                    slot='append'
                                    icon='el-icon-search'
                                    @click='listOrders'>
                                </el-button>
                            </el-input>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col>
                            <el-table
                                :data="orders"
                                tooltip-effect='dark'
                                style="width: 100%"
                                border
                                stripe>
                                <el-table-column
                                    type="index"
                                    label="#"
                                    width="55"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="orderId"
                                    label="订单号"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="untitled"
                                    label="订单商品"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="totalAmount"
                                    label="订单总价"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="actualAmount"
                                    label="支付价格"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="支付方式"
                                    align="center">
                                    <template v-slot="scope">
                                        <span v-if="scope.row.payType===1">微信支付</span>
                                        <span v-if="scope.row.payType===2">支付宝支付</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="订单状态"
                                    align="center">
                                    <template v-slot="scope">
                                        <el-tag v-if="scope.row.status===1" type="danger">待付款</el-tag>
                                        <el-tag v-if="scope.row.status===2" type="warning">待发货</el-tag>
                                        <el-tag v-if="scope.row.status===3" type="warning">待收货</el-tag>
                                        <el-tag v-if="scope.row.status===4" type>待评价</el-tag>
                                        <el-tag v-if="scope.row.status===5" type="success">已完成</el-tag>
                                        <el-tag v-if="scope.row.status===6" type="info">已关闭</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="创建时间"
                                    align="center">
                                    <template v-slot='scope'>
                                        {{scope.row.createTime | dateformat}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="200px">
                                    <template v-slot='scope'>
                                        <el-tooltip class='item' effect='dark' content='订单详情' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='primary'
                                                icon='el-icon-document'
                                                @click='handleOrderDetail(scope.row)'>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='删除订单' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='danger'
                                                icon='el-icon-delete'
                                                @click='handleDelOrder(scope.row)'>
                                            </el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row class="page-row">
                        <el-col>
                            <el-pagination
                                align="center"
                                layout="prev, pager, next"
                                @current-change="handlePageChange"
                                :current-page="queryInfo.pagenum"
                                :page-size="queryInfo.pagesize"
                                :total="pageInfo.total"
                                background>
                            </el-pagination>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
    name: "Order",
    components: {
        Breadcrumb,
    },
    data() {
        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '订单管理', path: ''},
                {name: '订单列表', path: ''}
            ],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            pageInfo: {
                total: 0,
                /*总页码*/
                pages: 0
            },
            orders: []
        }
    },
    methods: {
        async listOrders() {
            const {data: res} = await this.$http.get(`order/list`, {params: this.queryInfo});

            if (res.code !== 200) {
                return this.$message.error({message: "获取订单列表失败", center: true});
            }

            this.orders = res.data.pageInfo.list;
            this.pageInfo.total = res.data.pageInfo.total;
            this.pageInfo.pages = res.data.pageInfo.pages;
        },

        handlePageChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.listOrders();
        },

        clearSearch() {
            this.handlePageChange(1);
        },

        async handleDelOrder(order) {
            const confirmRes = await this.$confirm(`是否删除该订单: ${order.orderId}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.delete(`order/del/${order.orderId}`);

            if (res.code !== 204) {
                return this.$message.error({message: "删除订单列表失败", center: true});
            }

            this.$message.success({message: "删除订单成功", center: true});
            this.listOrders();
        },

        handleOrderDetail(order) {
            this.$router.push(
                {
                    name: 'order-detail',
                    params: {
                        orderId: order.orderId
                    }
                }
            )
        }
    },
    mounted() {
        this.listOrders();
    }
}
</script>

<style scoped>

</style>