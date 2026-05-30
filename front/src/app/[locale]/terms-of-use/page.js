import '@/styles/CookiePolicy.scss';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const termsContentByLocale = {
    en: {
        title: 'Terms of Use',
        intro: 'These Terms of Use govern access to and use of this website. By browsing or using the website, you agree to these terms.',
        updatedLabel: 'Last updated',
        updatedAt: 'May 30, 2026',
        sections: [
            {
                heading: '1. General',
                paragraphs: [
                    'This website is provided for informational, communication, and business presentation purposes related to Eduard Akhramovych and Art Nation.',
                    'We may update or modify website content and functionality at any time without prior notice.',
                ],
            },
            {
                heading: '2. Acceptable use',
                list: [
                    'You agree to use the website lawfully and in a way that does not interfere with its normal operation.',
                    'You must not attempt unauthorized access to the website, its administration area, servers, or connected systems.',
                    'You must not use the website to transmit malicious code, spam, or fraudulent requests.',
                ],
            },
            {
                heading: '3. Intellectual property',
                paragraphs: [
                    'Unless otherwise stated, website content, text, design, images, branding, and other materials are protected by applicable intellectual property rights.',
                    'You may not copy, republish, distribute, or commercially exploit website materials without prior permission, except where such use is allowed by law.',
                ],
            },
            {
                heading: '4. Accuracy of information',
                paragraphs: [
                    'We aim to keep website information accurate and up to date, but we do not guarantee that all materials will always be complete, current, or error-free.',
                ],
            },
            {
                heading: '5. Third-party links and services',
                paragraphs: [
                    'The website may contain links to third-party services, social platforms, or external resources. We are not responsible for the content, availability, or policies of those third parties.',
                ],
            },
            {
                heading: '6. Disclaimer of warranties',
                paragraphs: [
                    'The website is provided on an "as is" and "as available" basis to the extent permitted by applicable law. We do not guarantee uninterrupted availability or that the website will always be free from defects, delays, or security issues.',
                ],
            },
            {
                heading: '7. Limitation of liability',
                paragraphs: [
                    'To the extent permitted by law, we are not liable for indirect, incidental, special, or consequential damages arising from use of or inability to use the website.',
                ],
            },
            {
                heading: '8. Privacy and cookies',
                paragraphs: [
                    'Use of the website may also be subject to our Privacy Policy and Cookie Policy, which explain how information and cookies are handled.',
                ],
            },
            {
                heading: '9. Changes to these terms',
                paragraphs: [
                    'We may revise these Terms of Use from time to time. The current version will always be posted on this page.',
                ],
            },
            {
                heading: '10. Contact',
                contact: {
                    label: 'If you have questions about these Terms of Use, please contact us:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: available via the contact form on this website',
                    ],
                },
            },
        ],
    },
    ua: {
        title: 'Умови використання',
        intro: 'Ці Умови використання регулюють доступ до цього сайту та користування ним. Переглядаючи або використовуючи сайт, ви погоджуєтеся з цими умовами.',
        updatedLabel: 'Оновлено',
        updatedAt: '30 травня 2026',
        sections: [
            {
                heading: '1. Загальні положення',
                paragraphs: [
                    'Цей сайт надається для інформаційних цілей, комунікації та презентації діяльності Eduard Akhramovych і Art Nation.',
                    'Ми можемо змінювати або оновлювати вміст і функціональність сайту в будь-який час без попереднього повідомлення.',
                ],
            },
            {
                heading: '2. Допустиме використання',
                list: [
                    'Ви погоджуєтеся використовувати сайт законно та без втручання в його нормальну роботу.',
                    'Вам заборонено намагатися отримати несанкціонований доступ до сайту, його адміністративної частини, серверів або пов’язаних систем.',
                    'Вам заборонено використовувати сайт для передавання шкідливого коду, спаму або шахрайських запитів.',
                ],
            },
            {
                heading: '3. Інтелектуальна власність',
                paragraphs: [
                    'Якщо не зазначено інше, вміст сайту, тексти, дизайн, зображення, бренд-матеріали та інші елементи захищені відповідними правами інтелектуальної власності.',
                    'Ви не можете копіювати, повторно публікувати, поширювати або комерційно використовувати матеріали сайту без попереднього дозволу, окрім випадків, прямо дозволених законом.',
                ],
            },
            {
                heading: '4. Точність інформації',
                paragraphs: [
                    'Ми прагнемо підтримувати інформацію на сайті точною та актуальною, але не гарантуємо, що всі матеріали завжди будуть повними, актуальними або безпомилковими.',
                ],
            },
            {
                heading: '5. Сторонні посилання та сервіси',
                paragraphs: [
                    'Сайт може містити посилання на сторонні сервіси, соціальні платформи або зовнішні ресурси. Ми не несемо відповідальності за зміст, доступність або політики таких третіх сторін.',
                ],
            },
            {
                heading: '6. Відмова від гарантій',
                paragraphs: [
                    'У межах, дозволених застосовним законодавством, сайт надається за принципом "як є" та "за наявності". Ми не гарантуємо безперервну доступність сайту або відсутність помилок, затримок чи проблем безпеки.',
                ],
            },
            {
                heading: '7. Обмеження відповідальності',
                paragraphs: [
                    'У межах, дозволених законом, ми не несемо відповідальності за непрямі, випадкові, спеціальні або опосередковані збитки, що виникають у зв’язку з використанням або неможливістю використання сайту.',
                ],
            },
            {
                heading: '8. Конфіденційність і cookies',
                paragraphs: [
                    'Користування сайтом також може регулюватися нашою Політикою конфіденційності та Політикою cookies, які пояснюють, як обробляється інформація та використовуються cookies.',
                ],
            },
            {
                heading: '9. Зміни до цих умов',
                paragraphs: [
                    'Ми можемо періодично оновлювати ці Умови використання. Актуальна версія завжди буде опублікована на цій сторінці.',
                ],
            },
            {
                heading: '10. Контакти',
                contact: {
                    label: 'Якщо у вас є запитання щодо цих Умов використання, зв’яжіться з нами:',
                    items: [
                        `Website: ${siteConfig.siteUrl}`,
                        'Email: через контактну форму на цьому сайті',
                    ],
                },
            },
        ],
    },
};

function getTermsContent(locale) {
    return termsContentByLocale[locale] ?? termsContentByLocale.en;
}

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const content = getTermsContent(locale);

    return buildMetadata({
        locale,
        title: content.title,
        description: content.intro,
        pathname: '/terms-of-use',
    });
}

export default async function TermsOfUsePage({ params }) {
    const { locale } = await params;
    const content = getTermsContent(locale);

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
