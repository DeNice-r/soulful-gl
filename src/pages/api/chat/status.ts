import { db } from '~/server/db';
import { getServerSession } from '~/utils/getServerSession';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (!req.body.isOnline) {
        res.status(400).end();
        return;
    }
    const isOnline: boolean = req.body.isOnline as boolean;

    const session = await getServerSession(req, res);
    const result = await db.user.update({
        where: { email: session?.user?.email },
        data: {
            isOnline,
            latestStatusConfirmationAt: new Date(),
        },
    });
    res.json({ isOnline: result.isOnline });
}
