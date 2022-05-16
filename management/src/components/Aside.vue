<template>
    <div>
        <!--侧边菜单-->
        <el-menu class="aside_menu"
                 background-color="#333744"
                 text-color="#fff"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :default-active="this.$route.name"
                 unique-opened
                 router>

            <!--一级菜单-->
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-house aside_icon"></i>
                    <span>系统首页</span>
                </template>

                <!--二级菜单-->
                <el-menu-item index="index">
                    <i class="el-icon-menu aside_icon"></i>
                    系统首页
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-user aside_icon"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="users">
                    <i class="el-icon-menu aside_icon"></i>
                    用户列表
                </el-menu-item>
                <el-menu-item index="farmers">
                    <i class="el-icon-menu aside_icon"></i>
                    农户列表
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-set-up aside_icon"></i>
                    <span>分类管理</span>
                </template>
                <el-menu-item index="category">
                    <i class="el-icon-menu aside_icon"></i>
                    分类列表
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-goods aside_icon"></i>
                    <span>商品管理</span>
                </template>
                <el-menu-item index="goods-list">
                    <i class="el-icon-menu aside_icon"></i>
                    商品列表
                </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-s-order aside_icon"></i>
                    <span>订单管理</span>
                </template>
                <el-menu-item index="order">
                    <i class="el-icon-menu aside_icon"></i>
                    订单列表
                </el-menu-item>
            </el-submenu>
           <!-- <el-submenu index="6">
                <template slot="title">
                    <i class="el-icon-chat-line-square aside_icon"></i>
                    <span>评论管理</span>
                </template>
                <el-menu-item index="comment">
                    <i class="el-icon-menu aside_icon"></i>
                    评论列表
                </el-menu-item>
            </el-submenu>-->
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "Aside",
    props: ['isCollapse'],
}
</script>

<style scoped>
/*侧边菜单使的边框线使看起来不平*/
.aside_menu {
    border: none;
}

.aside_icon {
    color: #ffffff;
}
</style>