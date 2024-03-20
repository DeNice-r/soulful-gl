import { UserRole } from '~/utils/types';
import { StatusCodes } from 'http-status-codes';
import { db } from '~/server/db';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerSession } from '~/utils/getServerSession';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }

    const { notes } = req.body as { notes: string };
    const userId = req.query.userId as string;

    const session = await getServerSession(req, res);

    if (!session || session.user.role < (UserRole.OPERATOR as number)) {
        return res.status(StatusCodes.UNAUTHORIZED);
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: {
                notes,
            },
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }

    return res.status(StatusCodes.OK);
}
