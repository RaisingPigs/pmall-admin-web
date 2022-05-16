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
                    <el-row>
                        <el-col>
                            <el-alert
                                title="添加商品信息"
                                type="info"
                                show-icon
                                center
                                :closable="false">
                            </el-alert>
                        </el-col>
                    </el-row>
                    <el-row class="steps-row">
                        <el-col>
                            <el-steps :active="Number(activeStep)" finish-status="success" align-center>
                                <el-step title="基本信息"></el-step>
                                <el-step title="商品参数"></el-step>
                                <el-step title="商品sku"></el-step>
                                <el-step title="商品图片"></el-step>
                                <el-step title="确认添加"></el-step>
                            </el-steps>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col>
                            <el-tabs 
                                     v-model="activeStep"
                                     tab-position="left"
                                     :before-leave="beforeTabLeave">
                                <el-tab-pane label="基本信息" name="0">
                                    <product-basic-info ref='productInfoFormRef'/>
                                </el-tab-pane>
                                <el-tab-pane label="商品参数" name="1">
                                    <product-param ref="productParamFormRef"/>
                                </el-tab-pane>
                                <el-tab-pane label="商品sku" name="2">
                                    <product-sku ref="productSkuRef"/>
                                </el-tab-pane>
                                <el-tab-pane label="商品图片" name="3">
                                    <product-img ref="productImgRef"/>
                                </el-tab-pane>
                                <el-tab-pane label="确认添加" name="4">
                                    <submit-product/>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import ProductBasicInfo from "@/components/ProductBasicInfo";
import ProductParam from "@/components/ProductParam";
import ProductSku from "@/components/ProductSku";
import ProductImg from "@/components/ProductImg";
import SubmitProduct from "@/components/SubmitProduct";

export default {
    name: "GoodsAdd",
    components: {
        Breadcrumb,
        ProductBasicInfo,
        ProductParam,
        ProductSku,
        ProductImg,
        SubmitProduct
    },
    data() {
        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '商品管理', path: '/home/goods-list'},
                {name: '商品列表', path: '/home/goods-list'},
                {name: '商品添加', path: ''}
            ],
            /*设置激活步骤*/
            activeStep: '0'
        }
    },
    methods: {
        /*切换tab标签页触发事件*/
        beforeTabLeave(activeName, oldActiveName) {
            let flag = true;

            if (oldActiveName === '0') {
                flag = this.$refs.productInfoFormRef.checkForm();

                if (flag) {
                    this.$refs.productInfoFormRef.handleProductSend();
                }

                return flag;
            }

            if (oldActiveName === '1') {
                flag = this.$refs.productParamFormRef.checkForm();

                if (flag) {
                    this.$refs.productParamFormRef.handleProductParamSend();
                }

                return flag;
            }

            if (oldActiveName === '2') {
                flag = this.$refs.productSkuRef.checkProductSku();

                if (flag) {
                    this.$refs.productSkuRef.handleProductSkuSend();
                }

                return flag;
            }

            if (oldActiveName === '3') {
                flag = this.$refs.productImgRef.checkProductImg();
                if (flag) {
                    this.$refs.productImgRef.handleProductImgSend();
                }
                return flag;
            }

        }
    },
}
</script>

<style scoped>
.steps-row {
    margin: 20px 0;
}
</style>