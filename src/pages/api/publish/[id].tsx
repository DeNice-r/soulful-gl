import { type NextApiRequest, type NextApiResponse } from 'next';
import { db } from '~/server/db';

// PUT /api/publish/:id
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'PUT') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    if (!req.query.id || Array.isArray(req.query.id)) {
        res.status(400).json({ message: 'Missing post ID' });
        return;
    }
    const postId = req.query.id;
    const post = await db.post.update({
        where: { id: postId },
        data: { published: true },
    });
    res.json(post);
}
