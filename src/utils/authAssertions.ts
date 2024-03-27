import { AccessType, type RoleAssertionFunction } from '~/utils/types';

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
    const specificPermission = `${entity}:${action}`;
    const generalPermission = `${entity}:*`;
    const actionPermission = `*:${action}`;
    const allOwnPermission = '*:*';
    const allPermission = '*:*:*';

    if (
        userPermissions.includes(`${specificPermission}:*`) ||
        userPermissions.includes(`${generalPermission}:*`) ||
        userPermissions.includes(allPermission)
    ) {
        return AccessType.ALL;
    }

    if (
        userPermissions.includes(specificPermission) ||
        userPermissions.includes(generalPermission) ||
        userPermissions.includes(actionPermission) ||
        userPermissions.includes(allOwnPermission)
    ) {
        return AccessType.OWN;
    }

    // If none of the conditions are met, return NONE
    return AccessType.NONE;
};
