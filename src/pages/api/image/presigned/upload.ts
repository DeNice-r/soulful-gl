import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { type NextApiRequest, type NextApiResponse } from 'next';
import s3Client from '~/utils/s3/client';
import { randomUUID } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/env';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED);
    }

    // Parsing JSON body
    const { fileName, contentType } = req.body as {
        fileName: string;
        contentType: string;
    };

    if (!fileName || !contentType) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'File name and content type are required' });
    }

    const extension = fileName.split('.').pop();

    const newFileName = `${randomUUID()}.${extension}`;
    const Key = `uploads/${newFileName}`;
    const imageUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${Key}`;

    const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: `uploads/${newFileName}`,
        ContentType: contentType,
    });

    try {
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 30555,
        });
        res.status(StatusCodes.OK).json({ presignedUrl, imageUrl });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Error generating pre-signed URL',
        });
    }
}
