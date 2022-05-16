<template>
    <div>
        <el-form class="sku-form"
                 :model='productSkuForm'
                 :rules='productSkuFormRules'
                 ref='productSkuFormRef'
                 label-width='100px'
                 label-suffix=': '>
            <el-form-item label='sku名称' prop='skuName'>
                <el-input
                    v-model='productSkuForm.skuName'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='原价' prop='originalPrice'>
                <el-input
                    v-model.number='productSkuForm.originalPrice'
                    type='number'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='售价' prop='sellPrice'>
                <el-input
                    v-model='productSkuForm.sellPrice'
                    type='number'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='库存' prop='stock'>
                <el-input
                    v-model='productSkuForm.stock'
                    type='number'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='sku图片' prop='skuImg'>
                <input type="hidden" v-model="productSkuForm.skuImg">
                <el-upload
                    ref="imgUploadRef"
                    :action="uploadUrl"
                    :before-upload="beforeUpload"
                    :on-remove="handleImgRemove"
                    :headers='headerObj'
                    :limit="1"
                    list-type="picture"
                    :on-success="handleUploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传1个jpg或png文件,且不超过2M</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetSkuForm">取消</el-button>
                <el-button type="primary" @click="submitSkuForm">提交</el-button>
            </el-form-item>

            <el-form-item label='sku列表'>
                <el-table
                    :data="productSkus"
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
                        prop="skuName"
                        label="sku名称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="sku图片"
                        align="center">
                        <template v-slot="scope">
                            <el-image
                                :src="require(`@/assets/images/${scope.row.skuImg}`)"
                                fit="fill">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="originalPrice"
                        label="原价"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="sellPrice"
                        label="售价"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="折扣"
                        align="center">
                        <template v-slot="scope">
                            {{Number(scope.row.discounts).toFixed(1) * 10}}折
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="stock"
                        label="库存"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="是否上架"
                        align="center">
                        <template v-slot="scope">
                            <el-switch
                                v-model="scope.row.status===1"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="handleSkuDown(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center">
                        <template v-slot='scope'>
                            <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                                <el-button
                                    size='mini'
                                    type='danger'
                                    icon='el-icon-delete'
                                    @click='handleDeleteSku(scope.row)'>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "ProductSku",
    data() {
        function validateNumber(rule, value, callback) {
            if (value <= 0) {
                callback(new Error('输入必须大于0'));
            }
            callback();
        }

        return {
            /*商品信息增加表单数据对象*/
            productSkuForm: {
                skuName: '',
                originalPrice: 0,
                sellPrice: 0,
                discounts: 0,
                stock: 0,
                skuImg: '',
                status: 1
            },
            /*商品增加表单校验规则对象*/
            productSkuFormRules: {
                skuName: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                originalPrice: [
                    {required: true, message: '请输入商品原价', trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                sellPrice: [
                    {required: true, message: '请输入商品售价', trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                stock: [
                    {required: true, message: '请输入商品库存', trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                skuImg: [
                    {required: true, message: '请上传商品图片', trigger: 'blur'},
                ],
            },
            uploadUrl: 'http://localhost:9999/img/upload',
            headerObj: {
                Authorization: localStorage.getItem('token')
            },
            productSkus: []
        }
    },

    methods: {
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error({message: '上传文件格式只能是 JPG PNG格式!', center: true});

                return false;
            }
            if (!isLt2M) {
                this.$message.error({message: '上传头像图片大小不能超过 2MB!', center: true});
                return false;
            }

            return true;
        },

        handleImgRemove(file) {
            this.productSkuForm.skuImg = '';
        },

        handleUploadSuccess(res) {
            if (res.code !== 201) {
                this.$refs.imgUploadRef.clearFiles();
                
                return this.$message.error({message: '上传图片失败', center: true});
            }

            this.productSkuForm.skuImg = res.data.filename;
            this.$message.success({message: '上传图片成功', center: true})
        },

        async submitSkuForm() {
            await this.$refs.productSkuFormRef.validate((valid) => {
                if (!valid) {
                    return false;
                }

                const productSku = JSON.parse(JSON.stringify(this.productSkuForm));

                productSku.discounts = (productSku.sellPrice / productSku.originalPrice).toFixed(2);

                this.productSkus.push(productSku);
                this.resetSkuForm();
            });
        },

        resetSkuForm() {
            this.$refs.productSkuFormRef.resetFields();
            this.handleImgRemove();
            this.$refs.imgUploadRef.clearFiles();
        },

        handleDeleteSku(sku) {
            this.productSkus.splice(this.productSkus.indexOf(sku), 1);
        },
        handleSkuDown(sku) {
            if (sku.status === 1) {
                sku.status = 0;
            } else {
                sku.status = 1;
            }
        },
        handleProductSkuSend() {
            this.$bus.$emit('sendProductSkus', this.productSkus);
        },
        checkProductSku() {
            if (this.productSkus.length <= 0) {
                this.$message.error({message: '请上传商品图片', center: true});
                return false;
            }

            return true;
        }
    },
}
</script>

<style scoped>
.sku-form {
    width: 90%;
}

.el-image {
    width: 50px;
    height: 50px;
}
</style>