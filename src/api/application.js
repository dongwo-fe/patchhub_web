// 应用列表管理接口
import request from '@/utils/request';

// 获取列表
export function apiAppList(params) {
    return request.get(`/application/list`, params);
}

// 获取列表
export function apiAppAll() {
    return request.get(`/application/all`);
}
// 新增应用
export function apiAppAdd(data) {
    return request.post(`/application/add`, data);
}

// 编辑应用
export function apiAppEdit(data) {
    return request.post(`/application/edit`, data);
}

// 删除应用
export function apiAppDel(id) {
    return request.post(`/application/del`, { id });
}
