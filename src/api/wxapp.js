import request from '@/utils/request';

export function getpages(params) {
    return request.get('/wxpage', params);
}

export function usePage(data) {
    return request.post('/wxpage/edit', data);
}

export function delPage(data) {
    return request.post('/wxpage/del', data);
}

export function editPage(data) {
    return request.post('/wxpage/edit', data);
}
