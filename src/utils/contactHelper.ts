import { Language } from '../context/ThemeContext';

export const OWNER_EMAIL = 'pompeii928@gmail.com';

interface MailTemplate {
  subject: string;
  body: (senderInfo: string) => string;
}

const TEMPLATES: Record<Language, MailTemplate> = {
  ko: {
    subject: '[문의] K.F.C. Code Chaser 로봇공학 포트폴리오 - 배지훈',
    body: (senderInfo) => `안녕하세요 배지훈(Jihoon Bae) 님!

K.F.C. Code Chaser 로봇공학 포트폴리오를 보고 연락드립니다.

• 성함 / 소속: ${senderInfo}
• 연락처: 
• 문의 및 협업 제안 내용: 


감사합니다.`,
  },
  en: {
    subject: '[Inquiry] K.F.C. Code Chaser Robotics Portfolio - Jihoon Bae',
    body: (senderInfo) => `Hello Jihoon Bae,

I am reaching out regarding your K.F.C. Code Chaser Robotics Portfolio.

• Name / Organization: ${senderInfo}
• Contact Information: 
• Inquiry / Collaboration Details: 


Best regards,`,
  },
  ja: {
    subject: '【お問い合わせ】K.F.C. Code Chaser ロボット工学ポートフォリオ - Jihoon Bae',
    body: (senderInfo) => `Jihoon Bae 様

K.F.C. Code Chaser ロボット工学ポートフォリオを拝見し、ご連絡いたしました。

• お名前 / ご所属: ${senderInfo}
• ご連絡先: 
• お問い合わせ・協業内容: 


よろしくお願いいたします。`,
  },
  zh: {
    subject: '【咨询】K.F.C. Code Chaser 机器人工程作品集 - Jihoon Bae',
    body: (senderInfo) => `您好，Jihoon Bae！

我在浏览您的 K.F.C. Code Chaser 机器人工程作品集后向您致信。

• 姓名 / 单位: ${senderInfo}
• 联系方式: 
• 咨询 / 合作内容: 


祝好，`,
  },
  es: {
    subject: '[Consulta] Portafolio de Robótica K.F.C. Code Chaser - Jihoon Bae',
    body: (senderInfo) => `Hola Jihoon Bae,

Me pongo en contacto con usted con respecto a su Portafolio de Robótica K.F.C. Code Chaser.

• Nombre / Organización: ${senderInfo}
• Información de contacto: 
• Detalles de la consulta / colaboración: 


Saludos cordiales,`,
  },
  de: {
    subject: '[Anfrage] K.F.C. Code Chaser Robotik-Portfolio - Jihoon Bae',
    body: (senderInfo) => `Hallo Jihoon Bae,

ich kontaktiere Sie bezüglich Ihres K.F.C. Code Chaser Robotik-Portfolios.

• Name / Organisation: ${senderInfo}
• Kontaktdaten: 
• Anfrage / Details zur Zusammenarbeit: 


Mit freundlichen Grüßen,`,
  },
  fr: {
    subject: '[Demande] Portefeuille de Robotique K.F.C. Code Chaser - Jihoon Bae',
    body: (senderInfo) => `Bonjour Jihoon Bae,

Je vous contacte au sujet de votre portefeuille de robotique K.F.C. Code Chaser.

• Nom / Organisation: ${senderInfo}
• Coordonnées: 
• Détails de la demande / collaboration: 


Cordialement,`,
  },
};

export const openGmailCompose = (langParam?: Language) => {
  let activeLang: Language = langParam || 'ko';
  if (!langParam && typeof window !== 'undefined') {
    const stored = localStorage.getItem('kfc_language') as Language;
    if (stored && TEMPLATES[stored]) {
      activeLang = stored;
    }
  }

  const template = TEMPLATES[activeLang] || TEMPLATES.en;
  const savedName = typeof window !== 'undefined' ? localStorage.getItem('kfc_visitor_name') || '' : '';
  const savedOrg = typeof window !== 'undefined' ? localStorage.getItem('kfc_visitor_org') || '' : '';
  const senderInfo = savedName ? (savedOrg ? `${savedName} (${savedOrg})` : savedName) : '';

  const subject = encodeURIComponent(template.subject);
  const body = encodeURIComponent(template.body(senderInfo));

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${OWNER_EMAIL}&su=${subject}&body=${body}`;

  // Attempt to open Gmail compose in a new tab/window
  const newWin = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

  // Fallback to mailto protocol if popup is blocked
  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  }
};
