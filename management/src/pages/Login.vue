<template>
    <div class="login-container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/images/logo.png" alt="">
            </div>

            <!--登录表单区域-->
            <el-form
                ref="loginFormRef"
                class="login_form"
                :rules="loginFormRules"
                :model="loginForm">
                <el-form-item prop="username">
                    <el-input
                        v-model.trim="loginForm.username"
                        prefix-icon="el-icon-user"
                        placeholder="请输入密码"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        prefix-icon="el-icon-lock"
                        placeholder="请输入密码"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="login_btn"
                        type="primary"
                        @click="login">
                        <b>登 录</b>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    props: ['code', 'msg'],
    data() {
        return {
            /*登录表单数据绑定对象*/
            loginForm: {
                username: 'admin',
                password: 'admin',
            },
            /*表单验证规则对象*/
            loginFormRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        login() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) {
                    return false;
                }

                const {data: res} = await this.$http.post('/admin/login', this.loginForm);

                if (res.code !== 200) {
                    this.$message.error({message: res.msg, center: true});
                    return false;
                } else {
                    this.$message.success({message: '登录成功', center: true});

                    /*保存token*/
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));

                    /*跳转到主页*/
                    await this.$router.push('/home');
                    return true;
                }
            });
        },
    },
    mounted() {
        if (this.code === 401) {
            this.$message.error({message: this.msg, center: true});
        }
    }
}
</script>

<style scoped>
.login-container {
    height: 100%;
    background: #545c64;
}

.login-container > .login_box {
    width: 450px;
    height: 320px;
    background: #ffffff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.login-container > .login_box > .avatar_box {
    width: 130px;
    height: 130px;
    border: #eee 1px solid;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    background: #ffffff;
    position: absolute;
    /*根据父元素的位置移动50%*/
    left: 50%;
    /*根据自己的原来的位置移动-50%*/
    transform: translate(-50%, -50%);

}

.login-container > .login_box > .avatar_box > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
}

.login-container > .login_box > .login_form {
    position: absolute;
    width: 100%;
    bottom: 0;
    box-sizing: border-box;
    padding: 22px 40px;
}

.login_form .login_btn {
    width: 100%;
}
</style>