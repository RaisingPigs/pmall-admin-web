import Vue from "vue";
import VueRouter from 'vue-router';

/*使用路由*/
Vue.use(VueRouter);

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import Index from "@/pages/Index"
import Users from "@/pages/user/Users";
import GoodsList from "@/pages/goods/GoodsList";
import Order from "@/pages/order/Order";
import Comment from "@/pages/comment/Comment";
import GoodsAdd from "@/pages/goods/GoodsAdd";
import Category from "@/pages/category/Category";
import OrderDetail from "@/pages/order/OrderDetail";
import Farmers from "@/pages/user/Farmers";

const router = new VueRouter({
    routes: [
        {
            /*访问主页面时, 重定向到登录页面*/
            path: '/',
            redirect: '/login'
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
            props: true,
            meta: {isAuth: true, title: '登录'}
        },
        {
            name: 'home',
            path: '/home',
            component: Home,
            meta: {isAuth: true, title: '主页'},
            redirect: '/home/welcome',
            children: [
                {
                    name: 'welcome',
                    path: 'welcome',
                    component: Welcome,
                    meta: {isAuth: true, title: '欢迎'},
                },
                {
                    name: 'index',
                    path: 'index',
                    component: Index,
                    meta: {isAuth: true, title: '首页'},
                },
                {
                    name: 'users',
                    path: 'users',
                    component: Users,
                    meta: {isAuth: true, title: '用户列表'},
                },
                {
                    name: 'farmers',
                    path: 'farmers',
                    component: Farmers,
                    meta: {isAuth: true, title: '农户列表'},
                },
                {
                    name: 'category',
                    path: 'category',
                    component: Category,
                    meta: {isAuth: true, title: '分类列表'},
                },
                {
                    name: 'goods-list',
                    path: 'goods-list',
                    component: GoodsList,
                    meta: {isAuth: true, title: '商品列表'}
                },
                {
                    name: 'order',
                    path: 'order',
                    component: Order,
                    meta: {isAuth: true, title: '订单管理'},
                },
                {
                    name: 'comment',
                    path: 'comment',
                    component: Comment,
                    meta: {isAuth: true, title: '商品评论'},
                },
                {
                    name: 'goods-add',
                    path: 'goods-add',
                    component: GoodsAdd,
                    meta: {isAuth: true, title: '商品添加'}
                },
                {
                    name: 'order-detail',
                    path: 'order-detail',
                    component: OrderDetail,
                    props: true,
                    meta: {isAuth: true, title: '商品添加'}
                }
            ]
        },
    ]
});

/*全局前置路由守卫: 初始化时调用, 每次路由切换之前被调用*/
// router.beforeEach((to, from, next) => {
// 
// });

/*全局后置路由守卫: 初始化时调用, 每次路由切换之后被调用*/
router.afterEach((to, from) => {
    document.title = to.meta.title;
});

export default router;