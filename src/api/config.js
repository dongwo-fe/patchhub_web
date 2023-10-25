import request from '@/utils/request';

// 全局配置

export function apiConfigGet(data) {
    return request.get('/config/setting', data);
}

export function apiConfigEdit(data) {
    return request.post('/config/setting', data);
}
