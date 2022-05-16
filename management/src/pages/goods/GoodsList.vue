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
                        <span>商品列表</span>
                    </div>

                    <!--搜索框-->
                    <el-row :gutter='15' type="flex" align="middle">
                        <el-col :span="3" class="qwe" align="right">
                            <span>请选择商品分类: </span>
                        </el-col>
                        <el-col :span='6'>
                            <Cascader/>
                        </el-col>

                        <el-col :span='10'>
                            <!--@clear事件, 当点击清空键清空文本框时触发-->
                            <el-input placeholder='请输入内容' v-model='queryInfo.query'
                                      @keyup.enter.native='handleProductSearch'
                                      @clear='handlePageChange(1)' clearable>
                                <el-button slot='append' icon='el-icon-search' @click='handleProductSearch'></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span='5'>
                            <el-button type='primary' @click="handleProductAdd">增加商品</el-button>
                            <el-button type='warning'>批量操作</el-button>
                        </el-col>
                    </el-row>

                    <el-row class="table-row">
                        <el-col v-if="categorySelectedId">
                            <el-table
                                :data="products"
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
                                    prop="productName"
                                    label="商品名"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="商品图片"
                                    align="center">
                                    <template v-slot="scope">
                                        <el-image
                                            :src="require(`@/assets/images/${scope.row.productImg.url}`)"
                                            fit="fill">
                                        </el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="soldNum"
                                    label="销量"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="是否上架"
                                    align="center">
                                    <template v-slot="scope">
                                        <el-switch
                                            v-model="scope.row.productStatus===1"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            @change="handleProductDown(scope.row)">
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="创建时间"
                                    align="center"
                                    width="160">
                                    <template v-slot='scope'>
                                        {{scope.row.createTime | datetimeformat}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="修改时间"
                                    align="center"
                                    width="160">
                                    <template v-slot='scope'>
                                        {{scope.row.updateTime | datetimeformat}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="200px">
                                    <template v-slot='scope'>
                                        <el-tooltip class='item' effect='dark' content='编辑商品' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='primary'
                                                icon='el-icon-edit'
                                                @click=''>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='删除商品' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='danger'
                                                icon='el-icon-delete'
                                                @click='handleProductDel(scope.row.productId, scope.row.productName)'>
                                            </el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                        <el-col
                            v-else>
                            <el-alert
                                title="选择分类后才能展示商品"
                                type="warning"
                                show-icon
                                :closable="false">
                            </el-alert>
                        </el-col>
                    </el-row>
                    <el-row class="page-row">
                        <el-col v-if="categorySelectedId">
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
import Cascader from "@/components/Cascader";

export default {
    name: "List",
    components: {
        Breadcrumb,
        Cascader
    },
    data() {
        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '商品管理', path: ''},
                {name: '商品列表', path: ''}
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
            categorySelectedId: 0,
            products: []
        }
    },
    methods: {
        getCategory(categoryIds) {
            this.categorySelectedId = categoryIds[2];
            this.queryInfo.pagenum = 1;
            this.listProducts();
        },

        async listProducts() {
            /*如果查询参数不为空, 则是搜索查询, 应当重置页码*/
            if (this.queryInfo.query.trim() !== '' || this.queryInfo.query.length !== 0) {
                this.queryInfo.pagenum = 1;
            }

            const {data: res} = await this.$http.get(`product/list/${this.categorySelectedId}`, {params: this.queryInfo});

            if (res.code !== 200) {
                return this.$message.error({message: "获取商品列表失败", center: true});
            }

            this.products = res.data.pageInfo.list;
            this.pageInfo.total = res.data.pageInfo.total;
            this.pageInfo.pages = res.data.pageInfo.pages;
        },

        handleProductSearch() {
            if (!this.categorySelectedId) {
                return this.$message.error({message: "请选择分类后再搜索", center: true});
            }
            if (!this.queryInfo.query) {
                return this.$message.error({message: "请输入内容后再搜索", center: true});
            }

            this.listProducts();
        },

        handlePageChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.listProducts();
        },

        async handleProductDel(productId, productName) {
            const confirmRes = await this.$confirm(`是否删除商品: ${productName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.delete(`product/del/${productId}`);

            if (res.code !== 204) {
                return this.$message.error({message: "删除商品失败", center: true});
            }

            this.$message.success({message: "删除商品成功", center: true});
            await this.listProducts();
        },

        async handleProductDown(product) {
            if (product.productStatus === 1) {
                const {data: res} = await this.$http.put(`product/down/${product.productId}/0`);

                if (res.code !== 200) {
                    return this.$message.error({message: "下架商品失败", center: true});
                }

                this.$message.success({message: "下架商品成功", center: true});
            } else {
                const {data: res} = await this.$http.put(`product/down/${product.productId}/1`);

                if (res.code !== 200) {
                    return this.$message.error({message: "上架商品失败", center: true});
                }

                this.$message.success({message: "上架商品成功", center: true});
            }

            await this.listProducts();
        },

        async listSKu(productId) {
            const {data: res} = await this.$http.get(`sku/list/${productId}`);

            if (res.code !== 200) {
                return this.$message.error({message: "获取sku失败", center: true});
            }

            console.log(res);
        },

        handleProductAdd() {
            this.$router.push({name: 'goods-add'});
        }
    },

    mounted() {
        this.$bus.$on('categoryChange', this.getCategory);
    },

    beforeDestroy() {
        this.$bus.$off('categoryChange');
    }
}
</script>

<style scoped>
.el-alert {
    width: 98%;
    margin: 30px auto 10px;
}

.el-image {
    width: 50px;
    height: 50px;
}
</style>