import { db } from '~/server/db';
import * as console from 'console';

import { updatePermissions } from '~/utils/updatePermissions';
import { createCaller } from '~/server/api/root';
import { logWithDivider } from '~/utils';

const USERS = [
    {
        email: 'kdenis0610@gmail.com',
        password: 'pa$$worD',
        description: 'Admin user',
        name: 'Denys',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/default_avatar.png',
        notes: 'A complicated case',
    },
    {
        email: 'zipzk211_cham@student.ztu.edu.ua',
        password: 'pa$$worD',
        description: 'Admin user',
        name: 'Anton-Cherniuk',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/default_avatar.png',
        notes: 'A complicated case',
    },
];

const POSTS = [
    {
        title: 'Hello, cruel World!',
        description: 'This is the first post on the blog.',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/2024-03-21_212527.png',

        tags: ['hello', 'world'],

        published: true,
    },
    {
        title: 'Goodbye, cruel World!',
        description:
            'This is the second post on the blog. Something long this time 😘 "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/photo_2022-09-09_18-24-58.jpg',

        tags: ['bye', 'city'],

        published: true,
    },
    {
        title: 'I am back',
        description: "This one's a bit shorter. 😎",
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/2024-03-21_212527.png',

        tags: ['hello', 'world'],

        published: true,
    },
    {
        title: 'No, I am not',
        description: 'Part 2 of the previous post. 😂',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/photo_2022-09-09_18-24-58.jpg',

        tags: ['bye', 'city'],

        published: true,
    },
    {
        title: 'Haha, you are so easy to fool 😂',
        description: 'Last thing for today. 😘',
        image: 'https://soulful-images.s3.eu-central-1.amazonaws.com/2024-03-21_212527.png',

        tags: ['hello', 'world'],

        published: true,
    },
];

const caller = createCaller({
    db,
    session: {
        user: {
            permissions: ['*:*:*'],
            id: '',
            name: '',
            email: '',
            image: '',
            busyness: 0,
            roles: [],
            suspended: false,
        },
        expires: 'no 😎',
    },
    entity: 'world',
    action: '6 days of creation 😈',
});

export default async function seed() {
    await Promise.all([updatePermissions(), createUsers(), createPosts()]);
}

async function createUsers() {
    const users = await caller.user.list();

    if (users.values.length) {
        perfectlyNormalLog('Users already exist');
        return;
    }

    for (const user of USERS) {
        try {
            const { id } = await caller.user.create(user);
            await caller.permission.addToUser({ entityId: id, title: '*:*:*' });
            await db.user.update({
                where: {
                    id,
                },
                data: {
                    roles: {
                        connectOrCreate: {
                            where: {
                                title: 'superadmin',
                            },
                            create: {
                                title: 'superadmin',
                                permissions: {
                                    connect: {
                                        title: '*:*:*',
                                    },
                                },
                            },
                        },
                    },
                },
            });
        } catch (error) {
            perfectlyNormalLog(`Error creating user with ${user.email}`);
        }
    }

    logWithDivider('Users created');
}

async function createPosts() {
    const posts = await caller.post.get();

    if (posts.length) {
        perfectlyNormalLog('Posts already exist');
        return;
    }

    for (const post of POSTS) {
        try {
            await caller.post.create(post);
        } catch (error) {
            perfectlyNormalLog(`Error creating post with ${post.title}`);
        }
    }

    logWithDivider('Posts created');
}

function perfectlyNormalLog(...args: unknown[]) {
    console.log(...args, 'which is perfectly normal.');
}

await seed();
