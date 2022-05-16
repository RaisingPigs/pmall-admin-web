<template>
    <div>
        <el-row v-if="checkProductInfo" class="res-row">
            <el-col>
                <el-result icon="info"
                           title="商品信息填写完毕"
                           subTitle="单击按钮提交所有商品信息">
                    <template slot="extra">
                        <el-button type="primary" size="medium" @click="submitProduct">提交</el-button>
                    </template>
                </el-result>
            </el-col>
        </el-row>

        <el-row v-else class="res-row">
            <el-col>
                <el-result icon="error"
                           title="错误提示"
                           subTitle="请填写完所有商品信息再提交">
                </el-result>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "SubmitProduct",
    data() {
        return {
            product: {},
            contentImgs: [],
            productParam: {},
            productSkus: [],
            productImgs: []
        }
    },
    computed: {
        checkProductInfo() {
            let flag = this.product.productName !== '' && this.product.categoryId > 0 && this.product.content !== '';
            let flag2 = this.productParam.eatMethod !== '';
            return this.productSkus.length > 0 && this.productImgs.length > 0;
        }
    },
    methods: {
        getProduct(product, contentImgs) {
            this.product = product;
            this.contentImgs = contentImgs;
        },
        getProductParam(productParam) {
            this.productParam = productParam;
        },
        getProductSkus(productSkus) {
            this.productSkus = productSkus;
        },
        getProductImgs(productImgs) {
            this.productImgs = productImgs;
        },
        async submitProduct() {
            const {data: res} = await this.$http.post(
                'product/add',
                {
                    product: this.product,
                    productParam: this.productParam,
                    productSkus: this.productSkus,
                    productImgs: this.productImgs
                }
            );

            if (res.code !== 201) {
                return this.$message.error({message: '添加商品失败', center: true})
            }

            this.$message.success({message: '添加商品成功', center: true});
            this.$router.push({
                name: 'goods-list'
            });
        }
    },
    mounted() {
        this.$bus.$on('sendProduct', this.getProduct);
        this.$bus.$on('sendProductParam', this.getProductParam);
        this.$bus.$on('sendProductSkus', this.getProductSkus);
        this.$bus.$on('sendProductImgs', this.getProductImgs);
    },

    beforeDestroy() {
        this.$bus.$off('sendProduct');
        this.$bus.$off('sendProductParam');
        this.$bus.$off('sendProductSkus');
        this.$bus.$off('sendProductImgs');
    }
}
</script>

<style scoped>
.res-row {
    padding: 3% 0 18.5%;
}
</style>