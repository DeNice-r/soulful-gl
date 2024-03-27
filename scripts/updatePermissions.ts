import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';
import * as console from 'console';

export default async function updateDatabasePermissions() {
    const relevantPermissions = Array.from(getRelevantPermissions());

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
    const result: Record<string, string[]> = {};

    interface AppRouterStructure {
        [key: string]: {
            [key: string]: {
                _def?: {
                    meta?: {
                        hasPermissionProtection?: boolean;
                    };
                };
            };
        };
    }

    const typedAppRouter = appRouter as unknown as AppRouterStructure;
    for (const entity in typedAppRouter) {
        if (entity.startsWith('_')) continue;
        const actions = [];
        for (const action in typedAppRouter[entity]) {
            if (
                typedAppRouter[entity][action]?._def?.meta
                    ?.hasPermissionProtection
            ) {
                actions.push(action);
            }
        }
        if (actions.length > 0) {
            result[entity] = actions;
        }
    }

    const permissions = new Set<string>();
    for (const entity in result) {
        result[entity].push('*');
        for (let x = 0; x < result[entity].length; x++) {
            const action = result[entity][x];

            permissions.add(`${entity}:${action}`);
            permissions.add(`${entity}:${action}:*`);
            permissions.add(`*:${action}`);
            permissions.add(`*:${action}:*`);
        }
    }

    return permissions;
}

function logWithDivider(...args: any[]) {
    console.log(...args);
    console.log('-'.repeat(50));
}

console.log(
    'Warning: renamed permissions are treated as deleted and added again, so any users with the old permissions will lose them.',
);
setTimeout(() => {
    updateDatabasePermissions();
}, 5000);
