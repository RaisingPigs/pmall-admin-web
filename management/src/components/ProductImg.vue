<template>
    <div>
        <el-form class="img-form"
                 :model='productImgForm'
                 :rules='productImgFormRules'
                 ref='productImgFormRef'
                 label-width='100px'
                 label-suffix=': '>
            <el-form-item label='商品图片' prop='url'>
                <input type="hidden" v-model="productImgForm.url">
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
                <el-button @click="resetImgForm">取消</el-button>
                <el-button type="primary" @click="submitImgForm">提交</el-button>
            </el-form-item>

            <el-form-item label='图片列表'>
                <el-table
                    :data="productImgs"
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
                        label="图片"
                        align="center">
                        <template v-slot="scope">
                            <el-image
                                :src="require(`@/assets/images/${scope.row.url}`)"
                                fit="fill">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sort"
                        label="排序"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="是否为主图"
                        align="center">
                        <template v-slot="scope">
                            <el-switch
                                v-model="scope.row.isMain===1"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="handleImgBeMain(scope.row)">
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
                                    @click='handleDeleteImg(scope.row)'>
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
    name: "ProductImg",
    data() {
        return {
            baseSort: 1,
            /*商品信息增加表单数据对象*/
            productImgForm: {
                url: '',
                sort: 0,
                isMain: 0
            },
            /*商品增加表单校验规则对象*/
            productImgFormRules: {
                url: [
                    {required: true, message: '请上传商品图片', trigger: 'blur'},
                ],
            },
            uploadUrl: 'http://localhost:9999/img/upload',
            headerObj: {
                Authorization: localStorage.getItem('token')
            },
            productImgs: []
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
            this.productImgForm.url = '';
        },

        handleUploadSuccess(res) {
            if (res.code !== 201) {
                this.$refs.imgUploadRef.clearFiles();

                return this.$message.error({message: '上传图片失败', center: true});
            }

            this.productImgForm.url = res.data.filename;
            this.$message.success({message: '上传图片成功', center: true})
        },

        async submitImgForm() {
            await this.$refs.productImgFormRef.validate((valid) => {
                if (!valid) {
                    return false;
                }

                const productImg = JSON.parse(JSON.stringify(this.productImgForm));

                productImg.sort = this.baseSort++;
                if (productImg.sort === 1) {
                    productImg.isMain = 1;
                }

                this.productImgs.push(productImg);
                this.resetImgForm();
            });
        },

        resetImgForm() {
            this.$refs.productImgFormRef.resetFields();
            this.handleImgRemove();
            this.$refs.imgUploadRef.clearFiles();
        },

        handleDeleteImg(img) {
            this.productImgs.splice(this.productImgs.indexOf(img), 1);
        },

        handleImgBeMain(img) {
            if (img.isMain === 1) {
                return this.$message.error({message: '请选择其他的图作为主图', center: true});
            }

            for (const productImg of this.productImgs) {
                productImg.isMain = 0;
            }
            img.isMain = 1;
        },
        
        handleProductImgSend() {
            this.$bus.$emit('sendProductImgs', this.productImgs);
        },

        checkProductImg() {
            if (this.productImgs.length <= 0) {
                this.$message.error({message: '请上传商品图片', center: true});
                return false;
            }

            return true;
        }
    },
}
</script>

<style scoped>
.img-form {
    width: 90%;
}

.el-image {
    width: 50px;
    height: 50px;
}
</style>