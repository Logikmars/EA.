import '@/styles/CookiePolicy.scss';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const policyContentByLocale = {
    en: {
        title: 'Cookie Policy',
        intro: 'This Cookie Policy explains how we use cookies and similar technologies on this website. On your first visit, you can accept all cookies, reject optional cookies, or save your preferences through the cookie banner. Your choice can be updated at any time from the footer.',
        updatedLabel: 'Last updated',
        updatedAt: 'May 30, 2026',
        sections: [
            {
                heading: '1. Introduction',
                paragraphs: [
                    'This Cookie Policy explains how cookies and similar technologies are used on this website operated under the Eduard Akhramovych and Art Nation brand.',
                    'Some cookies are strictly necessary for the secure operation of the website. Optional cookies are used only if you give consent.',
                ],
            },
            {
                heading: '2. What are cookies?',
                paragraphs: [
                    'Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember preferences, and provide information about how the website is used.',
                ],
            },
            {
                heading: '3. Types of cookies we use',
                groups: [
                    {
                        title: 'a) Strictly necessary cookies',
                        text: 'These cookies support essential website functions such as security, admin authentication, request protection, and saving your cookie consent choice. They cannot be switched off from the banner because the site depends on them.',
                    },
                    {
                        title: 'b) Analytics and performance cookies',
                        text: 'These cookies help us understand how visitors use the website, which pages are viewed, and how traffic moves through the site. We use Google Analytics 4 only after you provide consent.',
                    },
                    {
                        title: 'c) Marketing cookies',
                        text: 'Marketing cookies are intended for advertising, remarketing, conversion measurement, or audience building across websites. They are currently inactive by default and are loaded only if you explicitly allow them in the future.',
                    },
                ],
            },
            {
                heading: '4. Cookie table',
                table: {
                    headers: ['Category', 'Provider', 'Purpose', 'Retention', 'Type'],
                    rows: [
                        ['Necessary', siteConfig.siteUrl, 'Stores your cookie consent preferences.', '12 months', 'First-party'],
                        ['Necessary', siteConfig.siteUrl, 'Protects the contact form with a rate-limit identifier.', '30 days', 'First-party'],
                        ['Necessary', 'Auth.js / site backend', 'Maintains secure admin session state.', 'Session / provider managed', 'First-party'],
                        ['Analytics', 'Google Analytics 4', '_ga and related measurement cookies for page visits and traffic analytics after consent.', 'Up to 24 months', 'Third-party'],
                    ],
                },
            },
            {
                heading: '5. How long cookies are stored',
                list: [
                    'Session cookies are deleted when you close your browser.',
                    'Persistent cookies remain on your device for a defined period or until you delete them.',
                    'The retention period depends on the cookie purpose and provider settings.',
                ],
            },
            {
                heading: '6. Managing your cookie preferences',
                paragraphs: [
                    'You can change your cookie settings at any time through the Cookie Settings link in the footer.',
                    'You can also configure your browser to block or remove cookies. Please note that disabling necessary cookies may affect some parts of the website.',
                ],
            },
            {
                heading: '7. Third-party cookies',
                paragraphs: [
                    'When analytics cookies are enabled, Google Analytics 4 may place cookies on your device according to Google policies. Any future advertising or marketing tools will also be governed by the policies of their respective providers.',
                ],
            },
            {
                heading: '8. Changes to this policy',
                paragraphs: [
                    'We may update this Cookie Policy from time to time to reflect legal, technical, or operational changes. The latest version will always be published on this page.',
                ],
            },
            {
                heading: '9. Contact',
                contact: {
                    label: 'If you have questions about this Cookie Policy or our use of cookies, please contact us:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: available via the contact form on this website',
                    ],
                },
            },
        ],
    },
    ua: {
        title: 'Політика використання файлів cookie',
        intro: 'Ця Політика використання файлів cookie пояснює, як ми використовуємо cookies та подібні технології на цьому сайті. Під час першого відвідування ви можете прийняти всі cookies, відхилити необов’язкові або зберегти власні налаштування через банер. Свій вибір можна змінити в будь-який момент через посилання у футері.',
        updatedLabel: 'Оновлено',
        updatedAt: '30 травня 2026',
        sections: [
            {
                heading: '1. Вступ',
                paragraphs: [
                    'Ця Політика cookies пояснює, як cookies і подібні технології використовуються на сайті, що працює під брендом Eduard Akhramovych та Art Nation.',
                    'Частина cookies є суто необхідною для безпечної роботи сайту. Додаткові cookies використовуються лише після вашої згоди.',
                ],
            },
            {
                heading: '2. Що таке файли cookie?',
                paragraphs: [
                    'Cookies — це невеликі текстові файли, які зберігаються на вашому пристрої під час відвідування вебсайту. Вони допомагають сайтам працювати коректно, запам’ятовувати ваші налаштування та надавати інформацію про використання сайту.',
                ],
            },
            {
                heading: '3. Типи файлів cookie, які ми використовуємо',
                groups: [
                    {
                        title: 'a) Суто необхідні cookies',
                        text: 'Ці cookies підтримують базові функції сайту: безпеку, автентифікацію в адмінці, захист запитів і збереження вашого вибору щодо cookies. Їх не можна вимкнути через банер, оскільки без них сайт працюватиме некоректно.',
                    },
                    {
                        title: 'b) Аналітичні cookies',
                        text: 'Ці cookies допомагають зрозуміти, як відвідувачі користуються сайтом, які сторінки переглядають і як рухається трафік. Ми використовуємо Google Analytics 4 лише після отримання вашої згоди.',
                    },
                    {
                        title: 'c) Маркетингові cookies',
                        text: 'Маркетингові cookies призначені для реклами, ремаркетингу, вимірювання конверсій або формування аудиторій на різних сайтах. Зараз вони за замовчуванням неактивні та будуть завантажуватися лише якщо ви окремо надасте таку згоду в майбутньому.',
                    },
                ],
            },
            {
                heading: '4. Таблиця cookie',
                table: {
                    headers: ['Категорія', 'Провайдер', 'Призначення', 'Термін зберігання', 'Тип'],
                    rows: [
                        ['Необхідні', siteConfig.siteUrl, 'Зберігають ваш вибір щодо налаштувань cookies.', '12 місяців', 'Власні'],
                        ['Необхідні', siteConfig.siteUrl, 'Захищають контактну форму через rate-limit ідентифікатор.', '30 днів', 'Власні'],
                        ['Необхідні', 'Auth.js / бекенд сайту', 'Підтримують безпечний стан адмін-сесії.', 'Сесія / керується провайдером', 'Власні'],
                        ['Аналітичні', 'Google Analytics 4', '_ga та пов’язані cookies для переглядів сторінок і аналізу трафіку після згоди.', 'До 24 місяців', 'Сторонні'],
                    ],
                },
            },
            {
                heading: '5. Як довго зберігаються cookies?',
                list: [
                    'Сеансові cookies видаляються після закриття браузера.',
                    'Постійні cookies зберігаються на пристрої протягом визначеного строку або доки ви не видалите їх самостійно.',
                    'Тривалість зберігання залежить від призначення cookie та налаштувань провайдера.',
                ],
            },
            {
                heading: '6. Керування вашими налаштуваннями cookies',
                paragraphs: [
                    'Ви можете змінити налаштування cookies у будь-який момент через посилання Cookie Settings у футері сайту.',
                    'Також ви можете налаштувати браузер на блокування або видалення cookies. Зверніть увагу, що вимкнення необхідних cookies може вплинути на роботу окремих частин сайту.',
                ],
            },
            {
                heading: '7. Сторонні cookies',
                paragraphs: [
                    'Якщо ви дозволяєте аналітичні cookies, Google Analytics 4 може розміщувати cookies на вашому пристрої відповідно до політик Google. Майбутні рекламні або маркетингові інструменти також регулюватимуться політиками відповідних провайдерів.',
                ],
            },
            {
                heading: '8. Зміни до цієї політики',
                paragraphs: [
                    'Ми можемо періодично оновлювати цю Політику cookies, щоб відобразити юридичні, технічні або операційні зміни. Актуальна версія завжди публікується на цій сторінці.',
                ],
            },
            {
                heading: '9. Контакти',
                contact: {
                    label: 'Якщо у вас є запитання щодо цієї Політики cookies або використання cookies на сайті, зв’яжіться з нами:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: через контактну форму на цьому сайті',
                    ],
                },
            },
        ],
    },
};

function getPolicyContent(locale) {
    return policyContentByLocale[locale] ?? policyContentByLocale.en;
}

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const content = getPolicyContent(locale);

    return buildMetadata({
        locale,
        title: content.title,
        description: content.intro,
        pathname: '/cookie-policy',
    });
}

export default async function CookiePolicyPage({ params }) {
    const { locale } = await params;
    const content = getPolicyContent(locale);

    return (
        <section className='CookiePolicy'>
            <div className='CookiePolicy_container container'>
                <h1 className='CookiePolicy_title'>{content.title}</h1>
                <p className='CookiePolicy_intro'>{content.intro}</p>
                <p className='CookiePolicy_updated'>
                    {content.updatedLabel}: {content.updatedAt}
                </p>

                {content.sections.map((section) => (
                    <section className='CookiePolicy_section' key={section.heading}>
                        <h2 className='CookiePolicy_heading'>{section.heading}</h2>

                        {section.paragraphs?.map((paragraph) => (
                            <p className='CookiePolicy_text' key={paragraph}>{paragraph}</p>
                        ))}

                        {section.groups?.map((group) => (
                            <div className='CookiePolicy_group' key={group.title}>
                                <h3 className='CookiePolicy_groupTitle'>{group.title}</h3>
                                <p className='CookiePolicy_text'>{group.text}</p>
                            </div>
                        ))}

                        {section.table ? (
                            <div className='CookiePolicy_tableWrap'>
                                <div className='CookiePolicy_table'>
                                    <div className='CookiePolicy_tableRow CookiePolicy_tableRow__head'>
                                        {section.table.headers.map((header) => (
                                            <div className='CookiePolicy_tableCell' key={header}>{header}</div>
                                        ))}
                                    </div>
                                    {section.table.rows.map((row) => (
                                        <div className='CookiePolicy_tableRow' key={row.join('-')}>
                                            {row.map((cell) => (
                                                <div className='CookiePolicy_tableCell' key={cell}>{cell}</div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {section.list ? (
                            <ul className='CookiePolicy_list'>
                                {section.list.map((item) => (
                                    <li className='CookiePolicy_listItem' key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : null}

                        {section.contact ? (
                            <div className='CookiePolicy_contact'>
                                <p className='CookiePolicy_text'>{section.contact.label}</p>
                                {section.contact.items.map((item) => (
                                    <p className='CookiePolicy_text' key={item}>{item}</p>
                                ))}
                            </div>
                        ) : null}
                    </section>
                ))}
            </div>
        </section>
    );
}
