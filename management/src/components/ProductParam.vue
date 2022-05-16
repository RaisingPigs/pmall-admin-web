<template>
    <div>
        <el-form :model='productParamForm' :rules='productParamFormRules' ref='productParamFormRef'
                 label-width='100px'
                 label-suffix=': '>
            <el-form-item label='商品产地' prop='productPlace'>
                <el-input
                    v-model='productParamForm.productPlace'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='保质期' prop='footPeriod'>
                <el-input
                    v-model.number='productParamForm.footPeriod'
                    type='number'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='品牌' prop='brand'>
                <el-input
                    v-model='productParamForm.brand'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='生产厂商' prop='factoryName'>
                <el-input
                    v-model='productParamForm.factoryName'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='生产地址' prop='factoryAddress'>
                <el-input
                    v-model='productParamForm.factoryAddress'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='包装方式' prop='packagingMethod'>
                <el-input
                    v-model='productParamForm.packagingMethod'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='重量' prop='weight'>
                <el-input
                    v-model='productParamForm.weight'
                    type='number'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='存储方式' prop='storageMethod'>
                <el-input
                    v-model='productParamForm.storageMethod'
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label='食用方式' prop='eatMethod'>
                <el-input
                    v-model='productParamForm.eatMethod'
                    clearable>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "ProductParam",
    data() {
        function validateNumber(rule, value, callback) {
            if (value <= 0) {
                callback(new Error('输入必须大于0'));
            }
            callback();
        }

        return {
            /*商品信息增加表单数据对象*/
            productParamForm: {
                productPlace: '',
                footPeriod: 0,
                brand: '',
                factoryName: '',
                factoryAddress: '',
                packagingMethod: '',
                weight: 0,
                storageMethod: '',
                eatMethod: ''
            },
            /*商品增加表单校验规则对象*/
            productParamFormRules: {
                productPlace: [
                    {required: true, message: '请输入商品产地', trigger: 'blur'}
                ],
                footPeriod: [
                    {required: true, message: '请输入保质期', trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                brand: [
                    {required: true, message: '请输入品牌', trigger: 'blur'},
                ],
                factoryName: [
                    {required: true, message: '请输入生产厂商', trigger: 'blur'},
                ],
                factoryAddress: [
                    {required: true, message: '请输入生产地址', trigger: 'blur'},
                ],
                packagingMethod: [
                    {required: true, message: '请输入包装方式', trigger: 'blur'},
                ],
                weight: [
                    {required: true, message: '请输入商品重量', trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                storageMethod: [
                    {required: true, message: '请输入存储方式', trigger: 'blur'},
                ],
                eatMethod: [
                    {required: true, message: '请输入食用方式', trigger: 'blur'},
                ],
            },
        }
    },

    methods: {
        checkForm() {
            let flag = false;
            this.$refs.productParamFormRef.validate((vaild) => {
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

        handleProductParamSend() {
            this.$bus.$emit('sendProductParam', this.productParamForm);
        }
    },
}
</script>

<style scoped>

</style>