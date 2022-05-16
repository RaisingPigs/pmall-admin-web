<template>
    <el-row class="header_row" type="flex" justify="space-between">
        <div class="header_logo" @click="toWelcome">
            <img src="@/assets/images/logo.png" alt="后台管理系统">
            <span>后台管理系统</span>
        </div>
        <div class="header_userInfo">
            <el-avatar class="head_portrait" :size="40" :src="userImg"></el-avatar>
            <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        {{user.nickname}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-row>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {};
    },
    computed: {
        user() {
            let userJson = localStorage.getItem('user');
            const user = JSON.parse(userJson);
            return user;
        },
        userImg() {
            return require(`@/assets/images/${this.user.userImg}`);
        }
    },
    methods: {
        toWelcome() {
            this.$router.push('/home/welcome');
        },

        async logout() {
            const {data: res} = await this.$http.get('admin/logout');
            
            if (res.code !== 200) {
                return this.$message.error({message: '退出失败', center: true});
            }

            this.$message.success({message: '退出成功', center: true});
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.header_row {
    height: 100%;
    color: #fff;
    padding: 5px;
}

.header_row .header_logo {
    display: flex;
    align-items: center;
    transition: 0.5s;
}

.header_row .header_logo:hover {
    cursor: pointer;
    text-shadow: 0 0 2px #ffffff;
    transform: scale(1.02, 1.02);
}

.header_row .header_logo > img {
    width: 150px;
}

.header_row .header_logo > span {
    font-size: 25px;
    font-weight: 600;
    margin-left: 5px;
}

.header_row > .header_userInfo {
    display: flex;
    align-items: center;
}

.header_row > .header_userInfo > .head_portrait {
    margin-right: 10px;
}

.header_row > .header_userInfo .el-dropdown-link {
    cursor: pointer;
    color: #fff;
}

.header_row > .header_userInfo .el-icon-arrow-down {
    font-size: 12px;
}

.header_row > .header_userInfo > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
}
</style>