export const MAX_TITLE_LENGTH = 50;
export const MAX_LANDING_POSTS_DESCRIPTION_LENGTH = 100;
export const MAX_POSTS_DESCRIPTION_LENGTH = 300;

export const DEFAULT_POSTS_LAYOUT_LIMIT = 8;
export const CHAT_POSTS_LAYOUT_LIMIT = 4;
export const DEFAULT_LIMIT = 9;
export const MAX_ASSET_LIMIT = 100;

export const DAY_MS = 86400000;

export const NO_REFETCH = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
};

export const AISystemMessage = {
    role: 'system',
    content:
        'Ви помічник психолога в чаті з його пацієнтами. Ви повинні надати наступне:\n' +
        'Визначити почуття пацієнта, якщо це можливо, дати фахівцю короткий аналіз повідомлень користувача (наприклад, чи є у користувача суїцидальні думки, чи він сумний, щасливий або щось інше).\n' +
        'Запропонувати тон і короткі інструкції щодо формування відповіді\n' +
        'Запропонувати лаконічну відповідь.\n' +
        'Додаткові дії, якщо вони потрібні (викликати швидку, поліцію і т.д.)\n' +
        'Якщо користувач задав подібне питання до Q&A - достатньо відповіді.\n' +
        'Ви отримаєте попередні повідомлення користувача та оператора для контексту. Відповідайте лише як помічник, не приймайте інші ролі. Розмовляйте українською.',
} as const;
