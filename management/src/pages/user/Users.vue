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
                        <span>用户列表</span>
                    </div>

                    <!--搜索框-->
                    <el-row :gutter='15'>
                        <el-col :span='10'>
                            <!--@clear事件, 当点击清空键清空文本框时触发-->
                            <el-input placeholder='请输入内容' v-model='queryInfo.query' @keyup.enter.native='listUsers'
                                      @clear='clearSearch' clearable>
                                <el-button slot='append' icon='el-icon-search' @click='listUsers'></el-button>
                            </el-input>
                        </el-col>
                        <el-col :span='8'>
                            <el-button type='primary' @click="openAddDialog">增加用户</el-button>
                            <el-button type='warning'>批量操作</el-button>
                        </el-col>
                    </el-row>

                    <el-row class="table-row">
                        <el-col>
                            <el-table
                                :data="users"
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
                                    prop="nickname"
                                    label="昵称"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="roleName"
                                    label="用户角色"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="username"
                                    label="用户名"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="性别"
                                    align="center"
                                    width="55">
                                    <template v-slot="scope">
                                        <span>{{scope.row.userSex === 'M' ? '男' : '女'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="userEmail"
                                    label="邮箱"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="userMobile"
                                    label="电话"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="生日"
                                    align="center">
                                    <template v-slot='scope'>
                                        {{scope.row.userBirth | dateformat}}
                                    </template>
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
                                                @click='handleUserDel(scope.row.userId, scope.row.nickname)'>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='权限设置' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='warning'
                                                icon='el-icon-setting'
                                                @click='openPowerDialog(scope.row)'>
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

                    <!--用户增加dialog-->
                    <el-dialog
                        title="增加用户"
                        :visible.sync="addDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeAddDialog">
                        <el-form ref="addFormRef"
                                 :rules="userFormRules"
                                 :model="addForm"
                                 label-width="80px">
                            <el-form-item label="用户昵称" prop="nickname">
                                <el-input v-model="addForm.nickname" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="addForm.username" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="addForm.password" 
                                          type="password"
                                          clearable></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名" prop="realname">
                                <el-input v-model="addForm.realname" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="userSex">
                                <el-select v-model="addForm.userSex" placeholder="请选择性别" clearable>
                                    <el-option label="男" value="M"></el-option>
                                    <el-option label="女" value="W"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="userEmail">
                                <el-input v-model="addForm.userEmail" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="电话" prop="userMobile">
                                <el-input v-model="addForm.userMobile" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="生日" prop="userBirth">
                                <el-date-picker
                                    v-model="addForm.userBirth"
                                    type="date"
                                    placeholder="选择日期" clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-form>

                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeAddDialog">取消</el-button>
                                <el-button type="primary" @click="handleUserAdd">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>

                    <!--用户修改dialog-->
                    <el-dialog
                        title="修改用户"
                        :visible.sync="updateDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeUpdateDialog">
                        <el-form ref="updateFormRef"
                                 :rules="userFormRules"
                                 :model="updateForm"
                                 label-width="80px">
                            <el-form-item label="用户昵称" prop="nickname">
                                <el-input v-model="updateForm.nickname" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="updateForm.username" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="userSex">
                                <el-select v-model="updateForm.userSex" placeholder="请选择性别" clearable>
                                    <el-option label="男" value="M"></el-option>
                                    <el-option label="女" value="W"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="userEmail">
                                <el-input v-model="updateForm.userEmail" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="电话" prop="userMobile">
                                <el-input v-model="updateForm.userMobile" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="生日" prop="userBirth">
                                <el-date-picker
                                    v-model="updateForm.userBirth"
                                    type="date"
                                    placeholder="选择日期" clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-form>


                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeUpdateDialog">取消</el-button>
                                <el-button type="primary" @click="handleUserUpdate">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>

                    <!--分配权限dialog-->
                    <el-dialog
                        title="分配权限"
                        :visible.sync="powerDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closePowerDialog">
                        <el-form ref="powerFormRef"
                                 :rules="userFormRules"
                                 :model="powerForm"
                                 label-width="100px">
                            <el-form-item label="用户昵称">
                                <el-input v-model="powerForm.nickname" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="用户名">
                                <el-input v-model="powerForm.username" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="用户角色">
                                <el-input v-model="powerForm.roleName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="分配新角色" prop="roleId">
                                <el-select v-model="powerForm.roleId" placeholder="请选择" clearable>
                                    <el-option
                                        v-for="role in roles"
                                        :key="role.roleId"
                                        :label="role.roleName"
                                        :value="role.roleId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                        <el-row>
                            <el-col align="right">
                                <el-button @click="closePowerDialog">取消</el-button>
                                <el-button type="primary" @click="handleUserPower">确定</el-button>
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
    name: "Users",
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
                {name: '用户管理', path: ''},
                {name: '用户列表', path: ''}
            ],
            users: [],
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
                nickname: '',
                username: '',
                password: '',
                realname: '',
                userSex: '',
                userMobile: '',
                userEmail: '',
                userBirth: ''
            },

            updateDialogVisible: false,
            updateForm: {},

            /*用户表单校验规则*/
            userFormRules: {
                nickname: [
                    {required: true, message: '请输入用户昵称', trigger: 'blur'},
                    {min: 2, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
                ],
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
                ],
                realname: [
                    {required: true, message: '请输入真实姓名', trigger: 'blur'},
                    {min: 2, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
                ],
                userSex: [
                    {required: true, message: '请选择性别', trigger: 'blur'}
                ],
                userEmail: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    /*element-ui设置 type:'email' 可开启邮箱校验*/
                    {type: 'email', message: '请输入正确的邮箱', trigger: 'blur'}
                ],
                userMobile: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur'}
                ],
                userBirth: [
                    {required: true, message: '请选择出生日期', trigger: 'blur'}
                ],
                roleId: [
                    {required: true, message: '请选择用户角色', trigger: 'blur'}
                ]
            },

            roles: [],
            powerDialogVisible: false,
            powerForm: {
                username: '',
                nickname: '',
                roleName: '',
                userId: '',
                roleId: ''
            }
        }
    },
    methods: {
        async listUsers() {
            const {data: res} = await this.$http.get('user/list', {params: this.queryInfo});

            if (res.code !== 200) {
                return this.$message.error({message: "获取用户列表失败", center: true});
            }

            this.users = res.data.userPage.list;
            this.pageInfo.total = res.data.userPage.total;
            this.pageInfo.pages = res.data.userPage.pages;
        },

        handlePageChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.listUsers();
        },

        clearSearch() {
            this.handlePageChange(1);
        },

        async handleUserDel(userId, username) {
            const confirmRes = await this.$confirm(`是否删除用户: ${username}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.delete(`user/del/${userId}`);

            if (res.code !== 204) {
                return this.$message.error({message: "删除用户失败", center: true});
            }


            this.$message.success({message: "删除用户成功", center: true});
            await this.listUsers();
        },

        openAddDialog(user) {
            this.addDialogVisible = true;
        },

        closeAddDialog() {
            this.$refs.addFormRef.resetFields();
            this.addDialogVisible = false;
        },

        async handleUserAdd() {
            this.$refs.addFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的用户信息', center: true});
                }

                const {data: res} = await this.$http.post(
                    'user/add',
                    this.addForm
                );

                if (res.code !== 201) {
                    return this.$message.error({message: "添加用户失败", center: true});
                }

                this.handlePageChange(this.pageInfo.pages + 1);
                this.addDialogVisible = false;
                this.$message.success({message: "增加用户成功", center: true});
            });
        },

        openUpdateDialog(user) {
            this.updateForm = JSON.parse(JSON.stringify(user));
            this.updateDialogVisible = true;
        },

        closeUpdateDialog() {
            this.$refs.updateFormRef.resetFields();
            this.updateDialogVisible = false;
        },

        handleUserUpdate() {
            this.$refs.updateFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的用户信息', center: true});
                }

                const {data: res} = await this.$http.put(`user/update`, this.updateForm);

                if (res.code !== 200) {
                    return this.$message.error({message: "修改用户失败", center: true});
                }

                await this.listUsers();
                this.updateDialogVisible = false;
                this.$message.success({message: "修改用户成功", center: true});
            });
        },

        async listRoles() {
            const {data: res} = await this.$http.get(`role/list`);

            if (res.code !== 200) {
                return this.$message.error({message: "获取角色列表失败", center: true});
            }

            this.roles = res.data.roles;
        },

        openPowerDialog(user) {
            this.listRoles();
            this.powerForm.nickname = user.nickname;
            this.powerForm.username = user.username;
            this.powerForm.roleName = user.roleName;
            this.powerForm.userId = user.userId;
            this.powerForm.roleId = user.roleId;
            this.powerDialogVisible = true;
        },

        closePowerDialog() {
            this.$refs.powerFormRef.resetFields();
            this.powerDialogVisible = false;
        },

        async handleUserPower() {
            this.$refs.powerFormRef.validate(async (vaild) => {
                if (!vaild) {
                    return this.$message.error({message: '请输入正确的信息', center: true});
                }

                const {data: res} = await this.$http.put(`user/power/${this.powerForm.userId}/${this.powerForm.roleId}`);

                if (res.code !== 200) {
                    return this.$message.error({message: "用户授权失败", center: true});
                }

                this.listUsers();
                this.powerDialogVisible = false;
                return this.$message.success({message: "用户授权成功", center: true});
            });
        }
    },
    mounted() {
        this.listUsers();
    }
}
</script>

<style scoped>

</style>