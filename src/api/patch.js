// 补丁管理的接口
import request from '@/utils/request';

// 获取列表
export function apiPatchList(params) {
    return request.get('/patch/list', params);
}
// 发布补丁
export function apiPatchAdd(params) {
    const { ...data } = params;
    return request.post('/patch/add', data);
}
// 编辑补丁
export function apiPatchEdit(data) {
    return request.post('/patch/edit', data);
}
// 撤回补丁
export function apiRetract(data) {
    return request.post('/patch/retract', data);
}
