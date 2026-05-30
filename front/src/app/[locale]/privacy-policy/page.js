import '@/styles/CookiePolicy.scss';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const privacyContentByLocale = {
    en: {
        title: 'Privacy Policy',
        intro: 'This Privacy Policy explains what personal data we may collect through this website, how we use it, and what choices you have. By using the website, you acknowledge this policy.',
        updatedLabel: 'Last updated',
        updatedAt: 'May 30, 2026',
        sections: [
            {
                heading: '1. Introduction',
                paragraphs: [
                    'This website is operated under the Eduard Akhramovych and Art Nation brand.',
                    'We respect your privacy and aim to process personal information responsibly, only for legitimate website and communication purposes.',
                ],
            },
            {
                heading: '2. Information we may collect',
                list: [
                    'Contact information you submit through the website, such as name, email address, phone number, and social or messenger link.',
                    'Message content you choose to send through the contact form.',
                    'Technical information related to website use, such as pages visited, general traffic data, and browser or device details when analytics is enabled.',
                ],
            },
            {
                heading: '3. How we use your information',
                list: [
                    'To respond to your inquiries and continue communication you requested.',
                    'To operate, secure, and improve the website and its core features.',
                    'To understand website traffic and performance when analytics cookies are enabled.',
                    'To comply with legal obligations or protect the website from abuse, fraud, or unauthorized access.',
                ],
            },
            {
                heading: '4. Legal basis and consent',
                paragraphs: [
                    'Where required, we rely on your consent for optional analytics technologies.',
                    'We may also process information where it is necessary to respond to your request, operate the website securely, or comply with legal obligations.',
                ],
            },
            {
                heading: '5. Cookies and analytics',
                paragraphs: [
                    'The website uses necessary cookies for security and technical operation. Optional analytics technologies such as Google Analytics 4 are activated only after consent.',
                    'More detail is available in the Cookie Policy published on this website.',
                ],
            },
            {
                heading: '6. Sharing of information',
                paragraphs: [
                    'We do not sell personal information submitted through this website.',
                    'Information may be processed by service providers that support hosting, website operation, analytics, or email delivery, but only as needed for those services.',
                ],
            },
            {
                heading: '7. Data retention',
                paragraphs: [
                    'We keep personal information only for as long as reasonably necessary for communication, website administration, legal compliance, and protection of legitimate interests.',
                ],
            },
            {
                heading: '8. Data security',
                paragraphs: [
                    'We use reasonable technical and organizational measures to protect information from unauthorized access, misuse, or disclosure. However, no internet transmission or storage system can be guaranteed to be completely secure.',
                ],
            },
            {
                heading: '9. Your rights',
                paragraphs: [
                    'Depending on applicable law, you may have rights to request access, correction, deletion, restriction, objection, or withdrawal of consent related to your personal information.',
                    'To make such a request, please contact us through the website contact form.',
                ],
            },
            {
                heading: '10. Changes to this policy',
                paragraphs: [
                    'We may update this Privacy Policy from time to time. The latest version will always be available on this page.',
                ],
            },
            {
                heading: '11. Contact',
                contact: {
                    label: 'If you have questions about this Privacy Policy, please contact us:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: available via the contact form on this website',
                    ],
                },
            },
        ],
    },
    ua: {
        title: 'Політика конфіденційності',
        intro: 'Ця Політика конфіденційності пояснює, які персональні дані можуть збиратися через цей сайт, як ми їх використовуємо та які варіанти вибору має користувач. Користуючись сайтом, ви підтверджуєте ознайомлення з цією політикою.',
        updatedLabel: 'Оновлено',
        updatedAt: '30 травня 2026',
        sections: [
            {
                heading: '1. Вступ',
                paragraphs: [
                    'Цей сайт працює під брендом Eduard Akhramovych та Art Nation.',
                    'Ми поважаємо вашу конфіденційність і прагнемо обробляти персональну інформацію відповідально та лише для законних цілей, пов’язаних із роботою сайту та комунікацією.',
                ],
            },
            {
                heading: '2. Яку інформацію ми можемо збирати',
                list: [
                    'Контактні дані, які ви надсилаєте через сайт: ім’я, email, номер телефону та посилання на соціальний профіль або месенджер.',
                    'Зміст повідомлення, яке ви добровільно надсилаєте через контактну форму.',
                    'Технічну інформацію про використання сайту, зокрема відвідані сторінки, загальні дані про трафік та характеристики браузера або пристрою, якщо увімкнена аналітика.',
                ],
            },
            {
                heading: '3. Як ми використовуємо інформацію',
                list: [
                    'Щоб відповісти на ваші запити та продовжити комунікацію, яку ви ініціювали.',
                    'Щоб підтримувати роботу, безпеку та вдосконалення сайту і його основних функцій.',
                    'Щоб розуміти трафік і ефективність сайту, якщо увімкнені аналітичні cookies.',
                    'Щоб виконувати юридичні обов’язки або захищати сайт від зловживань, шахрайства чи несанкціонованого доступу.',
                ],
            },
            {
                heading: '4. Правові підстави та згода',
                paragraphs: [
                    'Якщо це вимагається, ми покладаємося на вашу згоду для використання необов’язкових аналітичних технологій.',
                    'Також ми можемо обробляти інформацію, коли це необхідно для відповіді на ваш запит, безпечної роботи сайту або виконання юридичних обов’язків.',
                ],
            },
            {
                heading: '5. Cookies та аналітика',
                paragraphs: [
                    'Сайт використовує необхідні cookies для безпеки та технічної роботи. Додаткові аналітичні інструменти, зокрема Google Analytics 4, активуються лише після вашої згоди.',
                    'Детальніша інформація наведена в Політиці cookies на цьому сайті.',
                ],
            },
            {
                heading: '6. Передача інформації третім сторонам',
                paragraphs: [
                    'Ми не продаємо персональну інформацію, яку ви надсилаєте через цей сайт.',
                    'Інформація може оброблятися сервісами, що підтримують хостинг, роботу сайту, аналітику або доставку електронної пошти, але лише в межах, необхідних для надання цих послуг.',
                ],
            },
            {
                heading: '7. Строк зберігання даних',
                paragraphs: [
                    'Ми зберігаємо персональну інформацію лише стільки, скільки це обґрунтовано потрібно для комунікації, адміністрування сайту, виконання юридичних обов’язків і захисту законних інтересів.',
                ],
            },
            {
                heading: '8. Безпека даних',
                paragraphs: [
                    'Ми використовуємо розумні технічні та організаційні заходи для захисту інформації від несанкціонованого доступу, зловживання або розголошення. Водночас жодна передача даних через інтернет або система зберігання не може гарантувати абсолютну безпеку.',
                ],
            },
            {
                heading: '9. Ваші права',
                paragraphs: [
                    'Залежно від застосовного законодавства, ви можете мати право на доступ, виправлення, видалення, обмеження обробки, заперечення або відкликання згоди щодо вашої персональної інформації.',
                    'Щоб подати такий запит, зв’яжіться з нами через контактну форму на сайті.',
                ],
            },
            {
                heading: '10. Зміни до цієї політики',
                paragraphs: [
                    'Ми можемо періодично оновлювати цю Політику конфіденційності. Актуальна версія завжди буде доступна на цій сторінці.',
                ],
            },
            {
                heading: '11. Контакти',
                contact: {
                    label: 'Якщо у вас є запитання щодо цієї Політики конфіденційності, зв’яжіться з нами:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: через контактну форму на цьому сайті',
                    ],
                },
            },
        ],
    },
};

function getPrivacyContent(locale) {
    return privacyContentByLocale[locale] ?? privacyContentByLocale.en;
}

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const content = getPrivacyContent(locale);

    return buildMetadata({
        locale,
        title: content.title,
        description: content.intro,
        pathname: '/privacy-policy',
    });
}

export default async function PrivacyPolicyPage({ params }) {
    const { locale } = await params;
    const content = getPrivacyContent(locale);

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
