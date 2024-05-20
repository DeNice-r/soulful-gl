import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { env } from '~/env';

const sesClient = new SESClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function sendEmail(
    from: string,
    to: string,
    subject: string,
    body: string,
) {
    const params = {
        Source: from,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Html: {
                    Data: body,
                },
            },
        },
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
    } catch (err) {
        console.error('Failed to send email.', err);
    }
}

type FromConstructorArgs = {
    name?: string;
    local?: string;
    subdomain?: string;
};

export function getFromEmail({ name, local, subdomain }: FromConstructorArgs) {
    return `${name ?? 'Платформа Soulful'} <${local ?? 'no-reply'}@${subdomain ? subdomain + '.' : ''}${env.AWS_SES_FROM_IDENTITY}>`;
}
