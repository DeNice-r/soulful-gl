import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { env } from '~/env';

const sesClient = new SESClient({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

async function sendEmail(
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

export async function sendRegEmail(
    to: string,
    name: string,
    password: string,
    host: string,
) {
    const subject = 'Вітаємо на платформі Soulful! Ось ваші дані для входу.';
    const body = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Ласкаво просимо до Soulful!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9; }
        .header { font-size: 24px; color: #444; }
        .content { margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: lightgray; border: 3px solid dimgray; color: white; border-radius: 10px; text-decoration: none; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Ласкаво просимо до Soulful!</div>
        <div class="content">
            <p>Привіт, ${name}!</p>
            <p>Ми раді вітати вас на борту! Ось усе, що вам потрібно для початку:</p>
            <p><b>Ваш автоматично згенерований пароль:</b> <code>${password}</code></p>
            <p>Будь ласка, змініть свій пароль після першого входу в систему.</p>
            <a href="http://${host}/api/auth/signin" class="button">Увійти до облікового запису</a>
            <p>Якщо у вас є питання або вам потрібна допомога, не соромтеся звертатися до нашої служби підтримки.</p>
        </div>
        <div class="footer">
            З найкращими побажаннями,<br>
            Команда Soulful
        </div>
    </div>
</body>
</html>`;
    await sendEmail(getFromEmail({ local: 'welcome' }), to, subject, body);
}

type FromConstructorArgs = {
    name?: string;
    local?: string;
    subdomain?: string;
};

export function getFromEmail({ name, local, subdomain }: FromConstructorArgs) {
    return `${name ?? 'Платформа Soulful'} <${local ?? 'no-reply'}@${subdomain ? subdomain + '.' : ''}${env.AWS_SES_FROM_IDENTITY}>`;
}
