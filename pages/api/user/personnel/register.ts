import prisma from '#prisma';
import { UserRole } from '#types';
import { getServerAuthSession } from '#getServerAuthSession';
import { NextApiRequest as Request, NextApiResponse as Response } from 'next';
import bcrypt from 'bcrypt';

export default async function handle(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(400).send('Method not allowed');
    }

    const session = await getServerAuthSession(req, res);

    if (session.user.role < UserRole.ADMIN) {
        return res.status(403).send('Unauthorized');
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
        return res.status(500).send(error.message);
    }

    return res.status(200);
}
