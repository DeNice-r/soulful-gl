import prisma from '#prisma';
import { UserRole } from '#/types';
import { STATUS_CODES } from 'node:http';
import { getServerAuthSession } from '#getServerAuthSession';

export default async function handle(req, res) {
    const { userId, notes } = req.body;

    const session = await getServerAuthSession(req, res);

    if (session.user.role < UserRole.OPERATOR) {
        return res.status(403).send('Unauthorized');
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
            .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }

    return res.status(STATUS_CODES.OK);
}
