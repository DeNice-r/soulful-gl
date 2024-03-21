import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { requestWrapper } from '~/pages/api/auth/[...nextauth]';
import { type UserRole } from '~/utils/types';

export const getServerSession = async (
    req: NextApiRequest,
    res: NextApiResponse,
) => {
    return await unstable_getServerSession(...requestWrapper(req, res));
};

export const isAtLeast = (userRole: UserRole, thesholdRole: UserRole) => {
    return (userRole as number) >= (thesholdRole as number);
};

export const isAtMost = (userRole: UserRole, thesholdRole: UserRole) => {
    return (userRole as number) <= (thesholdRole as number);
};

export const isExactly = (userRole: UserRole, thesholdRole: UserRole) => {
    return (userRole as number) === (thesholdRole as number);
};
