import { type NextApiRequest, type NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { api } from '~/utils/liqpay';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }

    const data = await api('checkout', req.query ?? {});
    res.status(StatusCodes.OK).send(data);
}
