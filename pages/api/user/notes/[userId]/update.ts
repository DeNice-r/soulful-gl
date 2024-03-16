import prisma from '#prisma';
import { UserRole } from '#types';
import { StatusCodes } from 'http-status-codes';
import { getServerAuthSession } from '#getServerAuthSession';

export default async function handle(req, res) {
    const { notes } = req.body;
    const userId = req.query.userId as string;

    const session = await getServerAuthSession(req, res);

    if (session.user.role < UserRole.OPERATOR) {
        return res.status(StatusCodes.UNAUTHORIZED);
    }

    try {
        await prisma.user.update({
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
