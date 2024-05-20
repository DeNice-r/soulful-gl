import { getFromEmail, sendEmail } from '~/utils/email/index';

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

export async function sendQandaEmail(
    to: string,
    name: string,
    question: string,
    answer: string,
) {
    const subject = 'Відповідь на ваше питання';
    const body = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Відповідь на ваше питання до команди Soulful.</title>
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
        <div class="header">Дякуємо за запитання! Сподіваємося ви не зачекалися на відповідь.</div>
        <div class="content">
            <p>Привіт, ${name}!</p>
            <p><b>Ваше питання:</b> ${question}</p>
            <p><b>Відповідь:</b> ${answer}</p>
        </div>
        <div class="footer">
            З найкращими побажаннями,<br>
            Команда Soulful
        </div>
    </div>
</body>
</html>`;
    await sendEmail(getFromEmail({ local: 'support' }), to, subject, body);
}

export async function sendQandaDeleteEmail(
    to: string,
    name: string,
    question: string,
) {
    const subject = 'Ваше питання було видалено';
    const body = `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Нажаль, команда Soulful вважає недоцільним відповідати на це запитання.</title>
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
        <div class="header">Нажаль, команда Soulful вважає недоцільним відповідати на це запитання.</div>
        <div class="content">
            <p>Привіт, ${name}!</p>
            <p><b>Ваше питання:<b> ${question}</p>
            <p>Наша команда вважає недоцільним відповідати на це запитання. Спробуйте задати інше запитання чи зв'яжіться з нами у одному з підтримуваних месенджерів</p>
        </div>
        <div class="footer">
            З найкращими побажаннями,<br>
            Команда Soulful
        </div>
    </div>
</body>
</html>`;
    await sendEmail(getFromEmail({ local: 'support' }), to, subject, body);
}
