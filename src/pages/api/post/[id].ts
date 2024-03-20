import { db } from '~/server/db';
import { StatusCodes } from 'http-status-codes';
import { type NextApiRequest, type NextApiResponse } from 'next';

// DELETE /api/post/:id
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (!req.query.id || Array.isArray(req.query.id)) {
        return res.status(StatusCodes.BAD_REQUEST);
    }
    const postId = req.query.id;
    if (req.method === 'DELETE') {
        const post = await db.post.delete({
            where: { id: postId },
        });
        res.json(post);
    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }
}
