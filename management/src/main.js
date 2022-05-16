import Vue from 'vue';
import App from './App.vue';

/*router.js中已经引入并使用了VueRooter, 所以这里只需要引入rooter.js即可*/
import router from '@/router/rooter';
/*引入全局css*/
import '@/assets/css/global.css';
/*引入element-ui*/
import '@/plugins/element';
/*引入axios*/
import axios from "axios";

/*引入进度条*/
import NProgress from 'nprogress';
/*引入进度条样式*/
import 'nprogress/nprogress.css';

/*导入富文本编辑器*/
import VueQuillEditor from 'vue-quill-editor'
/*导入富文本编辑器样式*/
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/*引入day.js时间处理库*/
import dayjs from 'dayjs';

Vue.prototype.$dayjs = dayjs;
/*全局过滤器*/
Vue.filter('datetimeformat', function(originVal) {
    return dayjs(originVal).format('YYYY-MM-DD HH:mm:ss');
});
Vue.filter('dateformat', function(originVal) {
    return dayjs(originVal).format('YYYY-MM-DD');
});

/*注册为全局可用组件*/
Vue.use(VueQuillEditor);

/*配置请求的根路径*/
axios.defaults.baseURL = 'http://localhost:9999/';

axios.interceptors.request.use(
    (config) => {
        NProgress.start();

        config.headers.Authorization = localStorage.getItem('token');
        return config;
    }
);
axios.interceptors.response.use(
    (config) => {
        NProgress.done();

        //当token过期时，获取错误信息，并清除本地存储的过期token
        if (config.data.code === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push({
                name: 'login',
                params: {
                    code:config.data.code,
                    msg:config.data.msg
                }
            });   //跳转到登录组件
        }

        return config;
    }
)

/*将axios挂载到Vue的原型对象上, 这样vm和vc就可以直接调用*/
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router,
    beforeCreate() {
        Vue.prototype.$bus = this;
    }
}).$mount('#app');
