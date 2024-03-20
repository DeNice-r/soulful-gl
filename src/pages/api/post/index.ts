import { getServerSession } from '~/utils/getServerSession';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { db } from '~/server/db';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (!req.body.title || !req.body.content) {
        res.status(400).end();
        return;
    }
    const { title, content } = req.body as {
        title: string;
        content: string;
    };

    const session = await getServerSession(req, res);
    const result = await db.post.create({
        data: {
            title: title,
            content: content,
            author: { connect: { email: session?.user?.email } },
        },
    });
    res.json(result);
}
