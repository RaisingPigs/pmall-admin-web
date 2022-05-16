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
                        <span>农户列表</span>
                    </div>

                    <!--搜索框-->
                    <el-row :gutter='15'>
                        <el-col :span='10'>
                            <!--@clear事件, 当点击清空键清空文本框时触发-->
                            <el-input placeholder='请输入内容' v-model='queryInfo.query' @keyup.enter.native='listFarmers'
                                      @clear='clearSearch' clearable>
                                <el-button slot='append' icon='el-icon-search' @click='listFarmers'></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span='8'>
                            <el-button type='primary' @click="openAddDialog">增加农户</el-button>
                            <!--<el-button type='warning'>批量操作</el-button>-->
                        </el-col>
                    </el-row>

                    <el-row class="table-row">
                        <el-col>
                            <el-table
                                :data="farmers"
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
                                    label="编号"
                                    prop="farmerId"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="farmerName"
                                    label="姓名"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="性别"
                                    align="center"
                                    width="55">
                                    <template v-slot="scope">
                                        <span>{{scope.row.farmerSex === 'M' ? '男' : '女'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="farmerAccount"
                                    label="账户"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="farmerAddr"
                                    label="住址"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="farmerPhone"
                                    label="电话"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="payment"
                                    label="待付款"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="200px">
                                    <template v-slot='scope'>
                                        <el-tooltip class='item' effect='dark' content='编辑用户' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='primary'
                                                icon='el-icon-edit'
                                                @click='openUpdateDialog(scope.row)'>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='删除用户' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='danger'
                                                icon='el-icon-delete'
                                                @click='handleFarmerDel(scope.row.farmerId, scope.row.farmerName)'>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='付款' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='warning'
                                                icon='el-icon-money'
                                                @click='handlePayment(scope.row)'>
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

                    <!--增加-->
                    <el-dialog
                        title="增加农户"
                        :visible.sync="addDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeAddDialog">
                        <el-form ref="addFormRef"
                                 :rules="farmerFormRules"
                                 :model="addForm"
                                 label-width="80px">
                            <el-form-item label="用户名" prop="farmerName">
                                <el-input v-model="addForm.farmerName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="farmerSex">
                                <el-select v-model="addForm.farmerSex" placeholder="请选择性别" clearable>
                                    <el-option label="男" value="M"></el-option>
                                    <el-option label="女" value="W"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="账户" prop="farmerAccount">
                                <el-input v-model="addForm.farmerAccount" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="电话" prop="farmerPhone">
                                <el-input v-model="addForm.farmerPhone" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="地址" prop="farmerAddr">
                                <el-input v-model="addForm.farmerAddr" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeAddDialog">取消</el-button>
                                <el-button type="primary" @click="handleFarmerAdd">确定</el-button>
                            </el-col>
                        </el-row>
                        
                    </el-dialog>

                    <!--修改-->
                    <el-dialog
                        title="修改农户"
                        :visible.sync="updateDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeUpdateDialog">
                        <el-form ref="updateFormRef"
                                 :rules="farmerFormRules"
                                 :model="updateForm"
                                 label-width="80px">
                            <el-form-item label="用户名" prop="farmerName">
                                <el-input v-model="updateForm.farmerName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="farmerSex">
                                <el-select v-model="updateForm.farmerSex" placeholder="请选择性别" clearable>
                                    <el-option label="男" value="M"></el-option>
                                    <el-option label="女" value="W"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="账户" prop="farmerAccount">
                                <el-input v-model="updateForm.farmerAccount" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="电话" prop="farmerPhone">
                                <el-input v-model="updateForm.farmerPhone" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="地址" prop="farmerAddr">
                                <el-input v-model="updateForm.farmerAddr" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeUpdateDialog">取消</el-button>
                                <el-button type="primary" @click="handleFarmerUpdate">确定</el-button>
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
    name: "Farmers",
    components: {
        Breadcrumb,
    },
    data() {
        function checkMobile(rule, value, callback) {
            const patt = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

            if (patt.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的手机号'));
            }
        }

        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '农户管理', path: ''},
                {name: '农户列表', path: ''}
            ],
            farmers: [],
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

            addDialogVisible: false,
            addForm: {
                farmerName: '',
                farmerSex: '',
                farmerAccount: '',
                farmerPhone: '',
                farmerAddr: ''
            },

            updateDialogVisible: false,
            updateForm: {},

            /*用户表单校验规则*/
            farmerFormRules: {
                farmerName: [
                    {required: true, message: '请输入农户姓名', trigger: 'blur'},
                    {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
                ],
                farmerSex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                farmerAccount: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                ],
                farmerPhone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur'}
                ],
                farmerAddr: [
                    {required: true, message: '请填写农户地址', trigger: 'blur'}
                ]
            },
        }
    },
    methods: {
        async listFarmers() {
            const {data: res} = await this.$http.get('farmer/list', {params: this.queryInfo});

            if (res.code !== 200) {
                return this.$message.error({message: "获取农户列表失败", center: true});
            }

            this.farmers = res.data.pageInfo.list;
            this.pageInfo.total = res.data.pageInfo.total;
            this.pageInfo.pages = res.data.pageInfo.pages;
        },
        handlePageChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.listFarmers();
        },

        clearSearch() {
            this.handlePageChange(1);
        },

        async handleFarmerDel(farmerId, farmerName) {
            const confirmRes = await this.$confirm(`是否删除农户: ${farmerName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.delete(`farmer/del/${farmerId}`);

            if (res.code !== 204) {
                return this.$message.error({message: "删除农户失败", center: true});
            }


            this.$message.success({message: "删除农户成功", center: true});
            await this.listFarmers();
        },

        async handlePayment(farmer) {
            const confirmRes = await this.$confirm(`是否付款给农户 ${farmer.farmerName} ${farmer.payment}元?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.put(`farmer/pay/${farmer.farmerId}`);

            if (res.code !== 200) {
                return this.$message.error({message: "付款失败", center: true});
            }


            this.$message.success({message: "付款成功", center: true});
            await this.listFarmers();
        },

        openAddDialog() {
            this.addDialogVisible = true;
        },

        closeAddDialog() {
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },

        async handleFarmerAdd() {
            this.$refs.addFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的农户信息', center: true});
                }

                const {data: res} = await this.$http.post(
                    'farmer/add',
                    this.addForm
                );

                if (res.code !== 201) {
                    return this.$message.error({message: "添加农户失败", center: true});
                }

                this.handlePageChange(this.pageInfo.pages + 1);
                this.addDialogVisible = false;
                this.$message.success({message: "增加农户成功", center: true});
            });
        },

        openUpdateDialog(farmer) {
            this.updateForm = JSON.parse(JSON.stringify(farmer));
            this.updateDialogVisible = true;
        },

        closeUpdateDialog() {
            this.$refs.updateFormRef.resetFields();
            this.updateDialogVisible = false;
        },

        handleFarmerUpdate() {
            this.$refs.updateFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的用户信息', center: true});
                }

                const {data: res} = await this.$http.put(`farmer/update`, this.updateForm);

                if (res.code !== 200) {
                    return this.$message.error({message: "修改农户失败", center: true});
                }

                await this.listFarmers();
                this.updateDialogVisible = false;
                this.$message.success({message: "修改农户成功", center: true});
            });
        },
    },
    mounted() {
        this.listFarmers();
    }
}
</script>

<style scoped>

</style>