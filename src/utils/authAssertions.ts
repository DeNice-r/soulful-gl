import { AccessType } from '~/utils/types';

export const isPermitted = (
    userPermissions: string[],
    entity: string,
    action: string,
) => {
    const specificPermission = `${entity}:${action}`;
    const generalPermission = `${entity}:*`;
    // const actionPermission = `*:${action}`; // This is not used in the current implementation
    const allOwnPermission = '*:*';
    const allPermission = '*:*:*';

    if (
        userPermissions.includes(`${specificPermission}:*`) ||
        userPermissions.includes(`${generalPermission}:*`) ||
        // userPermissions.includes(`${actionPermission}:*`) ||
        userPermissions.includes(allPermission)
    ) {
        return AccessType.ALL;
    }

    if (
        userPermissions.includes(specificPermission) ||
        userPermissions.includes(generalPermission) ||
        // userPermissions.includes(actionPermission) ||
        userPermissions.includes(allOwnPermission)
    ) {
        return AccessType.OWN;
    }

    return AccessType.NONE;
};
