<template>
    <div>
        <el-form :model='productSkuForm' :rules='productSkuFormRules' ref='productSkuFormRef'
                 label-width='100px'
                 label-suffix=': '>
            <el-form-item label='商品sku' prop='skuKey'>
                <el-input
                    class="sku-input"
                    placeholder="请输入sku名"
                    v-model="skuKeyInput"
                    @keyup.enter="addSkuKey"
                    clearable>
                    <el-button slot="append" @click="addSkuKey">增加</el-button>
                </el-input>
                <div v-for="sku in skuObjs" :key="sku.index" class="sku-div">
                    <div>
                        <el-input class="sku-key-input"
                                  v-model="sku.key" 
                                  @change="skuKeyChange(sku)"
                                  clearable>
                        </el-input>
                    </div>
                    <div>
                        <el-tag
                            :key="tag"
                            v-for="tag in sku.value"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag, sku)">
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="sku.inputVisible"
                            v-model.trim="sku.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(sku)"
                            @blur="handleInputConfirm(sku)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(sku)">+ 新增属性</el-button>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "ErrProductSku",
    data() {
        return {
            tempId: -1,
            skuKeyInput: '',
            skuObjs: [],
            productSkuForm: {},
            productSkuFormRules: {}
        }
    },

    computed: {
        productSkus() {
            const skus = [];
            
            for (const skuObj of this.skuObjs) {
                skuObj.value.forEach((item1) => {
                    
                });
            }
        }
    },

    methods: {
        addSkuKey() {
            const skuObj = {
                index: ++this.tempId,
                key: this.skuKeyInput,
                value: [],
                inputVisible: false,
                inputValue: ''
            };

            this.skuObjs.push(skuObj);
            this.skuKeyInput = '';
        },

        handleClose(tag, sku) {
            sku.value.splice(sku.value.indexOf(tag), 1);
        },

        showInput(sku) {
            sku.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm(sku) {
            let inputValue = sku.inputValue;
            if (inputValue) {
                sku.value.push(inputValue);
            }
            sku.inputVisible = false;
            sku.inputValue = '';
        },

        skuKeyChange(sku) {
            if (sku.key === '') {
                this.skuObjs.splice(this.skuObjs.indexOf(sku), 1);
            }
        }
    },
}
</script>

<style scoped>
.el-tag {
    margin-right: 20px;
}

.button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    vertical-align: bottom;
}

.sku-input {
    width: 40%;
}

.sku-key-input {
    width: 20%;
}

.sku-div {
    width: 65%;
    padding: 10px;
    margin: 20px 0;
    background-color: #f8f9fc;
    border: 1px #ebeef5 solid;
    border-radius: 5px;
}
</style>