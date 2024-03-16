import prisma from '../../../lib/prisma';
import { StatusCodes } from 'http-status-codes';

// DELETE /api/post/:id
export default async function handle(req, res) {
    const postId = req.query.id;
    if (req.method === 'DELETE') {
        const post = await prisma.post.delete({
            where: { id: postId },
        });
        res.json(post);
    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }
}
