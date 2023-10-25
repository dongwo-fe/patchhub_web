import request from '@/utils/request';

export function uploadImage(params, file) {
    const form = new FormData();
    form.append('file', file);
    return request.post2Data('/api_image/upload', params, form);
}
