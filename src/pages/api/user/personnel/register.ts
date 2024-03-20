import { UserRole } from '~/utils/types';
import { getServerSession } from '~/utils/getServerSession';
import {
    type NextApiRequest as Request,
    type NextApiResponse as Response,
} from 'next';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { db } from '~/server/db';
import { env } from '~/env';

export default async function handle(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }

    const session = await getServerSession(req, res);

    if (!session || session.user.role < (UserRole.ADMIN as number)) {
        return res.status(StatusCodes.UNAUTHORIZED);
    }

    const { name, email, image, description, role, password } = req.body as {
        name: string;
        email: string;
        image: string;
        description: string;
        role: number;
        password: string;
    };

    try {
        await db.user.create({
            data: {
                name,
                email,
                image,
                role,
                description,
                password: bcrypt.hashSync(password, env.SALT_ROUNDS),
            },
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(error.message);
    }

    return res.status(StatusCodes.OK);
}
