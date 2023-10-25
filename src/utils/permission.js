import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
    if (!value) return true;

    const roles = store.getters && store.getters.roles;
    const permissionRoles = value.split(',');

    const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role);
    });
    // console.log(permissionRoles, roles, hasPermission);
    return hasPermission;
}
