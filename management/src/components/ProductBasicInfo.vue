<template>
    <div>
        <el-form :model='productInfoForm'
                 :rules='productInfoFormRules'
                 ref='productInfoFormRef'
                 label-width='100px'
                 label-suffix=': '>
            <el-form-item label='商品名称' prop='productName'>
                <el-input
                    v-model='productInfoForm.productName'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='商品分类' prop='categoryId'>
                <Cascader v-model="productInfoForm.categoryId"/>
            </el-form-item>
            <el-form-item label='商品介绍' prop='contentCheck' class="quill-editor-form-item">
                <el-upload
                    ref="imgUploadRef"
                    :action="uploadUrl"
                    :before-upload="beforeUpload"
                    :on-remove="handleImgRemove"
                    :headers='headerObj'
                    :limit="10"
                    list-type="picture"
                    :on-success="handleUploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传10个jpg或png文件,且不超过2M</div>
                </el-upload>
            </el-form-item>

            <el-form-item label='农户编号' prop='farmerId'>
                <el-input
                    v-model='productInfoForm.farmerId'
                    clearable>
                </el-input>
            </el-form-item>

            <el-form-item label='农户收益比' prop='proportion'>
                <el-input
                    v-model='productInfoForm.proportion'
                    clearable>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Cascader from "@/components/Cascader";
import axios from "axios";

export default {
    name: "ProductBasicInfo",
    components: {
        Cascader,
    },
    data() {
        function validateCategory(rule, value, callback) {
            if (value <= 0) {
                callback(new Error('请选择商品分类'));
            }
            callback();
        }

        let farmerName = "";

        async function validateFarmerId(rule, value, callback) {
            console.log(this)
            const {data: res} = await axios.get(`farmer/${value}`);

            if (res.code !== 200) {
                return callback(new Error('查询不到该农户'));
            }

            callback();
        }

        return {
            /*商品信息增加表单数据对象*/
            productInfoForm: {
                productName: '',
                categoryId: 0,
                rootCategoryId: 0,
                content: '',
                contentCheck: '',
                farmerId: '',
                proportion: 1
            },
            /*商品增加表单校验规则对象*/
            productInfoFormRules: {
                productName: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                categoryId: [
                    {validator: validateCategory, trigger: 'change'}
                ],
                content: [
                    {required: true, message: '请上传商品介绍图片', trigger: 'blur'}
                ],
                farmerId: [
                    {required: true, message: '请输入农户编号', trigger: 'blur'},
                    // {validator: validateFarmerId, trigger: 'blur'}
                ],
                proportion: [
                    {required: true, message: '请输入农户收益比例', trigger: 'blur'}
                ]
            },
            uploadUrl: 'http://localhost:9999/img/upload',
            headerObj: {
                Authorization: localStorage.getItem('token')
            },
            contentImgs: []
        }
    },

    methods: {
        getCategory(categoryIds) {
            this.productInfoForm.categoryId = categoryIds[2];
            this.productInfoForm.rootCategoryId = categoryIds[0];
        },
        checkForm() {
            let flag = false;
            this.$refs.productInfoFormRef.validate((vaild) => {
                if (vaild) {
                    flag = true;
                    return true;
                } else {
                    flag = false;
                    return false;
                }
            });

            return flag;
        },

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
            this.contentImgs.splice(this.contentImgs.indexOf(file.response.data.filename), 1);
            this.productInfoForm.contentCheck = '';
        },

        handleUploadSuccess(res) {
            if (res.code !== 201) {
                this.$refs.imgUploadRef.clearFiles();

                return this.$message.error({message: '上传图片失败', center: true});
            }

            this.productInfoForm.contentCheck = res.data.filename;
            this.contentImgs.push(res.data.filename);
            this.$message.success({message: '上传图片成功', center: true})
        },

        handleProductSend() {
            for (const contentImg of this.contentImgs) {
                let content = '<img src="static/images/'.concat(contentImg).concat('" alt=""/>');
                this.productInfoForm.content += content;
            }
            this.$bus.$emit('sendProduct', this.productInfoForm, this.contentImgs);
        }


    },

    mounted() {
        this.$bus.$on('categoryChange', this.getCategory);
    },

    beforeDestroy() {
        this.$bus.$off('categoryChange');
    },

    // async checkFarmerId() {
    //     const {data: res} = await this.$http.get(`farmer/${this.productInfoForm.farmerId}`);
    //
    //     if (res.code !== 200) {
    //         this.$message.error({message: "查询不到该农户", center: true});
    //         return false;
    //     }
    //
    //     return true;
    // }
}
</script>

<style scoped>
.el-form {
    width: 95%;
}


</style>