import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { requestWrapper } from '@/api/auth/[...nextauth]';

export const getServerAuthSession = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    return await unstable_getServerSession(...requestWrapper(req, res));
};
