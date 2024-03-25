import { getServerSession } from '~/utils/auth';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { db } from '~/server/db';

// POST /api/post
// Required fields in body: title, description
// Optional fields in body: image
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    if (!req.body.title || !req.body.description) {
        res.status(400).end();
        return;
    }
    const { title, description, image } = req.body as {
        title: string;
        description: string;
        image: string;
    };

    const session = await getServerSession(req, res);
    const result = await db.post.create({
        data: {
            title,
            description,
            image,
            author: { connect: { email: session?.user?.email } },
        },
    });
    res.json(result);
}
