import prisma from '#prisma';
import { UserRole } from '#types';
import { getServerAuthSession } from '#getServerAuthSession';
import { NextApiRequest as Request, NextApiResponse as Response } from 'next';
import bcrypt from 'bcrypt';

export default async function handle(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(400).send('Method not allowed');
    }

    const { name, image, description, role, password } = req.body;
    const userId = req.query.userId as string;

    const session = await getServerAuthSession(req, res);

    if (
        session.user.role < UserRole.OPERATOR ||
        (session.user.role !== UserRole.ADMIN && session.user.id !== userId)
    ) {
        return res.status(403).send('Unauthorized');
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
        return res.status(500).send(error.message);
    }

    return res.status(200);
}
