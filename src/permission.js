import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

store.dispatch('user/getInfo');

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title);

    if (to.query.code) {
        await store.dispatch('user/loginos', to.query.code);
        const query = to.query;
        delete query.code;
        next({ path: to.path, query });
        return;
    }
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            window.location.href = `${process.env.VUE_APP_LOGIN}?redirect=${encodeURIComponent(window.location.href)}`;
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
