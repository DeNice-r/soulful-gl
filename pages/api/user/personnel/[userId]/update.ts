import prisma from '#prisma';
import { UserRole } from '#types';
import { getServerAuthSession } from '#getServerAuthSession';
import { NextApiRequest as Request, NextApiResponse as Response } from 'next';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

export default async function handle(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }

    const { name, image, description, role, password } = req.body;
    const userId = req.query.userId as string;

    const session = await getServerAuthSession(req, res);

    if (
        session.user.role < UserRole.OPERATOR ||
        (session.user.role !== UserRole.ADMIN && session.user.id !== userId)
    ) {
        return res.status(StatusCodes.UNAUTHORIZED);
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                image,
                description,
                password: bcrypt.hashSync(password, process.env.SALT_ROUNDS),
                ...(session.user.role === UserRole.ADMIN && { role }),
            },
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }

    return res.status(StatusCodes.OK);
}
