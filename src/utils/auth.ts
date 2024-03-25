import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { requestWrapper } from '~/pages/api/auth/[...nextauth]';

export const getServerSession = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    return await unstable_getServerSession(...requestWrapper(req, res));
};
