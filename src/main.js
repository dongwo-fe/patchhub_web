import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import VueViewer from 'v-viewer';
import '@/styles/index.scss'; // global css
import 'viewerjs/dist/viewer.css';

import App from './App';
import store from './store';
import router from './router';
import moment from 'moment';

import '@/icons'; // icon
import '@/permission'; // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.use(VueViewer);

VueViewer.setDefaults({
    navbar: false,
    fullscreen: true,
});

Vue.filter('dateFormat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).format(pattern);
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
});
