import prisma from '../../../lib/prisma';
import { getServerAuthSession } from '#getServerAuthSession';

export default async function handle(req, res) {
    const { isOnline } = req.body;

    const session = await getServerAuthSession(req, res);
    console.log('session', session);
    const result = await prisma.user.update({
        where: { email: session?.user?.email },
        data: {
            isOnline,
            latestStatusConfirmationAt: new Date(),
        },
    });
    res.json({ isOnline: result.isOnline });
}
