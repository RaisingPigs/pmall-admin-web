<template>
    <div>
        <el-row>
            <el-col>
                <Breadcrumb :breadcrumb-list="breadcrumbList"></Breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-card>
                    <div class="order-info-div">
                        <el-row
                            class="status-row"
                            type="flex"
                            justify="space-between"
                            align="middle">
                            <el-col :span="4">
                                <span style="vertical-align: middle;">当前订单状态: </span>
                                <span>
                                <el-tag v-if="orders[0].status===1" type="danger">待付款</el-tag>
                                <el-tag v-if="orders[0].status===2" type="warning">待发货</el-tag>
                                <el-tag v-if="orders[0].status===3" type="warning">待收货</el-tag>
                                <el-tag v-if="orders[0].status===4">待评价</el-tag>
                                <el-tag v-if="orders[0].status===5" type="success">已完成</el-tag>
                                <el-tag v-if="orders[0].status===6" type="info">已关闭</el-tag>
                            </span>
                            </el-col>
                            <el-col :span="4">
                                <el-button
                                    v-if="orders[0].status===2"
                                    type="primary"
                                    size="mini"
                                    @click="showDeliveryDialog">
                                    点击发货
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row class="order-info-row">
                            <el-col>
                                <i class="el-icon-caret-right" style="font-size: 18px;"></i>
                                <span>基本信息</span>
                            </el-col>
                            <el-col>
                                <el-table
                                    :data="orders"
                                    tooltip-effect='dark'
                                    style="width: 100%"
                                    border
                                    stripe>
                                    <el-table-column
                                        prop="orderId"
                                        label="订单编号"
                                        align="center"
                                        width="180">
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
                                            <el-tag v-if="scope.row.status===4">待评价</el-tag>
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
                                        label="订单备注"
                                        align="center">
                                        <template v-slot="scope">
                                            <span>{{scope.row.orderRemark === '' ? '无' : scope.row.orderRemark}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="deliveryType"
                                        label="物流类型"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="deliveryFlowId"
                                        label="物流单号"
                                        align="center"
                                        width="160">
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                        <el-row class="order-info-row">
                            <el-col>
                                <i class="el-icon-caret-right" style="font-size: 18px;"></i>
                                <span>收货人信息</span>
                            </el-col>
                            <el-col>
                                <el-table
                                    :data="orders"
                                    tooltip-effect='dark'
                                    style="width: 100%"
                                    border
                                    stripe>
                                    <el-table-column
                                        prop="receiverName"
                                        label="收货人姓名"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="receiverMobile"
                                        label="收货人电话"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="receiverAddress"
                                        label="收货地址"
                                        align="center">
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                        <el-row class="order-info-row">
                            <el-col>
                                <i class="el-icon-caret-right" style="font-size: 18px;"></i>
                                <span>购买者信息</span>
                            </el-col>
                            <el-col>
                                <el-table
                                    :data="users"
                                    tooltip-effect='dark'
                                    style="width: 100%"
                                    border
                                    stripe>
                                    <el-table-column
                                        prop="nickname"
                                        label="购买人昵称"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="username"
                                        label="购买人用户名"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="userEmail"
                                        label="购买人邮箱"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="userMobile"
                                        label="购买人电话"
                                        align="center">
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                        <el-row class="order-info-row">
                            <el-col>
                                <i class="el-icon-caret-right" style="font-size: 18px;"></i>
                                <span>商品信息</span>
                            </el-col>
                            <el-col>
                                <el-table
                                    :data="orderItems"
                                    tooltip-effect='dark'
                                    style="width: 100%"
                                    border
                                    stripe>
                                    <el-table-column
                                        prop="productName"
                                        label="商品名"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="skuName"
                                        label="商品sku"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        label="商品图片"
                                        align="center">
                                        <template v-slot="scope">
                                            <el-image
                                                :src="require(`@/assets/images/${scope.row.skuImg}`)"
                                                fit="fill">
                                            </el-image>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="productPrice"
                                        label="价格"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="buyCounts"
                                        label="购买数量"
                                        align="center">
                                    </el-table-column>
                                    <el-table-column
                                        prop="totalAmount"
                                        label="小节"
                                        align="center">
                                    </el-table-column>
                                </el-table>
                            </el-col>
                        </el-row>
                    </div>

                    <el-dialog
                        title="订单发货"
                        :visible.sync="deliveryDialogVisible"
                        width="50%"
                        :before-close="handleDeliveryDialogClose">
                        <el-form ref="deliveryFormRef"
                                 :rules="deliveryFormRules"
                                 :model="deliveryForm"
                                 label-width="80px">
                            <el-form-item label="物流类型" prop="deliveryType">
                                <el-input v-model="deliveryForm.deliveryType" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="物流单号" prop="deliveryFlowId">
                                <el-input v-model="deliveryForm.deliveryFlowId" clearable></el-input>
                            </el-form-item>
                        </el-form>

                        <el-row>
                            <el-col align="right">
                                <el-button @click="handleDeliveryDialogClose">取消</el-button>
                                <el-button type="primary" @click="handleDelivery">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
    name: "OrderDetail",
    components: {
        Breadcrumb,
    },
    data() {
        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '订单管理', path: '/home/order'},
                {name: '订单列表', path: '/home/order'},
                {name: '订单列表', path: ''}
            ],
            orderVo: {},
            orders: [],
            users: [],
            orderItems: [],
            deliveryDialogVisible: false,
            deliveryForm: {
                deliveryType: '',
                deliveryFlowId: ''
            },
            /*用户表单校验规则*/
            deliveryFormRules: {
                deliveryType: [
                    {required: true, message: '请输入物流类型', trigger: 'blur'},
                ],
                deliveryFlowId: [
                    {required: true, message: '请输入物流单号', trigger: 'blur'},
                ]
            },
        }
    },
    props: ['orderId'],
    methods: {
        async getOrder() {
            const {data: res} = await this.$http.get(`order/${this.orderId}`);

            if (res.code !== 200) {
                return this.$message.error({message: "获取订单详情失败", center: true});
            }

            this.orderVo = res.data.orderVo;
            this.orders = [];
            this.users = [];
            this.orders.push(this.orderVo.order);
            this.users.push(this.orderVo.user);
            this.orderItems = res.data.orderVo.orderItems;
        },

        showDeliveryDialog() {
            this.deliveryDialogVisible = true;
        },

        async handleDelivery() {
            this.$refs.deliveryFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的物流信息', center: true});
                }

                const {data: res} = await this.$http.put(`order/delivery/${this.orderId}`, null, {params: this.deliveryForm});

                if (res.code !== 200) {
                    return this.$message.error({message: "发货失败", center: true});
                }

                this.$message.success({message: "发货成功", center: true});
                this.deliveryDialogVisible = false;
                await this.getOrder();

            });
        },

        handleDeliveryDialogClose() {
            this.deliveryDialogVisible = false;
            this.$refs.deliveryFormRef.resetFields();
        }
    },
    mounted() {
        this.getOrder();
    }
}
</script>

<style scoped>
.status-row {
    background-color: #f2f6fc;
    padding: 20px;
}

.order-info-row {
    padding: 20px;
}

.order-info-div {
    border: 1px solid #ebeef5;
}

.el-image {
    width: 50px;
    height: 50px;
}
</style>