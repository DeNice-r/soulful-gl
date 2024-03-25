import { type RoleAssertionFunction } from '~/utils/types';

export const isAtLeast: RoleAssertionFunction = (userRole, thesholdRole) => {
    return (userRole as number) >= (thesholdRole as number);
};

export const isAtMost: RoleAssertionFunction = (userRole, thesholdRole) => {
    return (userRole as number) <= (thesholdRole as number);
};

export const isExactly: RoleAssertionFunction = (userRole, thesholdRole) => {
    return (userRole as number) === (thesholdRole as number);
};

export const isPermitted = (
    userPermissions: string[],
    entity: string,
    action: string,
) => {
    const fitPermissions = [
        `${entity}:${action}`,
        `${entity}:*`,
        `*:${action}`,
        '*:*',
    ];
    return userPermissions.some((element) => fitPermissions.includes(element));
};
