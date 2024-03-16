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

    const session = await getServerAuthSession(req, res);

    if (session.user.role < UserRole.ADMIN) {
        return res.status(StatusCodes.UNAUTHORIZED);
    }

    const { name, email, image, description, role, password } = req.body;

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                image,
                role,
                description,
                password: bcrypt.hashSync(password, process.env.SALT_ROUNDS),
            },
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }

    return res.status(StatusCodes.OK);
}
