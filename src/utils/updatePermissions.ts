import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import * as console from 'console';
import { logWithDivider } from '~/utils/index';
import { type Meta } from '~/utils/types';

export async function updatePermissions() {
    console.log(
        'Warning: renamed permissions are treated as deleted and added again, so any users with the old permissions will lose them.',
    );

    const relevantPermissions = getRelevantPermissions();

    console.log(relevantPermissions);

    logWithDivider('Relevant permissions:', relevantPermissions.length);

    const currentPermissionRows = await db.permission.findMany({
        select: {
            title: true,
        },
    });

    const currentPermissions = currentPermissionRows.map((item) => item.title);

    logWithDivider('Current permissions:', currentPermissions.length);

    const itemsToAdd = relevantPermissions.filter(
        (item) => !currentPermissions.includes(item),
    );

    const itemsToRemove = currentPermissions.filter(
        (item) => !relevantPermissions.includes(item),
    );

    logWithDivider('Items to add:', itemsToAdd.length);
    logWithDivider('Items to remove:', itemsToRemove.length);

    let r = await db.permission.createMany({
        data: itemsToAdd.map((item) => ({ title: item })),
        skipDuplicates: true,
    });

    logWithDivider('Added permissions:', r.count);

    r = await db.permission.deleteMany({
        where: {
            title: {
                in: itemsToRemove,
            },
        },
    });

    logWithDivider('Removed permissions:', r.count);
}

function getRelevantPermissions() {
    const result: Record<string, { action: string; multilevel: boolean }[]> =
        {};

    interface AppRouterStructure {
        [key: string]: {
            [key: string]: {
                _def?: {
                    meta?: Meta;
                };
            };
        };
    }

    const typedAppRouter = appRouter as unknown as AppRouterStructure;
    for (const entity in typedAppRouter) {
        if (entity.startsWith('_')) continue;
        const actions = [];
        let hasSpaProtection = false;
        for (const action in typedAppRouter[entity]) {
            const meta = typedAppRouter[entity][action]?._def?.meta;
            if (meta?.hasSpaProtection) hasSpaProtection = true;
            else if (meta?.hasPermissionProtection) {
                actions.push({
                    action,
                    multilevel: meta?.hasMultilevelProtection ?? false,
                });
            }
        }
        if (actions.length > 0 || hasSpaProtection) {
            result[entity] = actions;
        }
    }

    const permissions = new Set<string>();
    for (const entity in result) {
        let hasMultilevel = false;
        for (let x = 0; x < result[entity].length; x++) {
            const { action, multilevel } = result[entity][x];

            permissions.add(`${entity}:${action}`);

            if (multilevel) {
                permissions.add(`${entity}:${action}:*`);
                hasMultilevel = true;
            }
        }
        permissions.add(`${entity}:*`);
        if (hasMultilevel) {
            permissions.add(`${entity}:*:*`);
        }
    }

    return Array.from(permissions.add('*:*:*'));
}
