/**
 * Puter AI Mini - Basit Sohbet
 * Ana JavaScript dosyası
 *
 * Sadeleştirilmiş versiyon:
 * - Sadece 4 model (ChatGPT, Kimi, Gemini, Claude) - OpenRouter üzerinden
 * - Sadece genel sohbet modu
 * - 11 dil desteği
 * - Resim desteği (video kaldırıldı)
 */

// --- STATE DEĞİŞKENLERİ ---
let chats = [];
let activeChatId = null;
let isUserSignedIn = false;
let currentLanguage = 'tr'; // Varsayılan dil
let currentStyle = 'normal'; // Varsayılan konuşma stili
let customStylePrompt = ''; // Özel stil prompt'u
let uploadedFile = null; // Yüklenen dosya (sadece resim)
let activeTab = 'chat'; // 'chat' veya 'image'

// --- DİL DESTEĞİ (11 DİL) ---
const LANGUAGES = {
  tr: { name: 'Türkçe', flag: '🇹🇷', prompt: 'Türkçe' },
  en: { name: 'English', flag: '🇺🇸', prompt: 'English' },
  zh: { name: '中文', flag: '🇨🇳', prompt: 'Chinese (Mandarin)' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', prompt: 'Hindi' },
  es: { name: 'Español', flag: '🇪🇸', prompt: 'Spanish' },
  fr: { name: 'Français', flag: '🇫🇷', prompt: 'French' },
  ar: { name: 'العربية', flag: '🇸🇦', prompt: 'Arabic' },
  bn: { name: 'বাংলা', flag: '🇧🇩', prompt: 'Bengali' },
  pt: { name: 'Português', flag: '🇧🇷', prompt: 'Portuguese' },
  ru: { name: 'Русский', flag: '🇷🇺', prompt: 'Russian' },
  ja: { name: '日本語', flag: '🇯🇵', prompt: 'Japanese' },
};

// Arayüz çevirileri (11 dil)
const UI_TRANSLATIONS = {
  tr: {
    newChat: 'Yeni Sohbet',
    login: 'Giriş Yap',
    guest: 'Misafir',
    processing: 'İşleniyor...',
    controlPanel: 'Kontrol Paneli',
    modeSettings: 'Dil ve Model Ayarları',
    aiEngine: 'Yapay Zeka Motoru',
    askSomething: 'Bir şeyler sor...',
    conversationStyle: 'Konuşma Stili',
    normal: 'Normal - Profesyonel',
    genZ: 'Z Kuşağı - 🔥💀 Argo',
    millennial: 'Y Kuşağı - Nostaljik',
    academic: 'Akademik - Bilimsel',
    friendly: 'Samimi - Arkadaşça 😊',
    custom: 'Özel - Kendi Stilin',
    customPromptPlaceholder: 'Özel konuşma stilinizi yazın...',
    language: 'Dil',
    chatTab: 'Sohbet',
    imageGenTab: 'Resim Oluştur',
    generate: 'Oluştur',
    download: 'İndir',
    generatedImages: 'Oluşturulan Resimler',
    imagePrompt: 'Prompt',
    imageModel: 'Model',
    unsupportedFileFormat: 'Desteklenmeyen dosya formatı. JPG, PNG, GIF veya HEIC kullanın.',
    enterPrompt: 'Lütfen bir prompt girin.',
    imageError: 'Resim oluşturma hatası:',
    emptyStateTitle: 'AI Mini Sohbet',
    emptyStateDesc: 'En popüler yapay zeka modelleri burada. Sağdan modelini seç ve sohbete başla.',
  },
  en: {
    newChat: 'New Chat',
    login: 'Sign In',
    guest: 'Guest',
    processing: 'Processing...',
    controlPanel: 'Control Panel',
    modeSettings: 'Language and Model Settings',
    aiEngine: 'AI Engine',
    askSomething: 'Ask something...',
    conversationStyle: 'Conversation Style',
    normal: 'Normal - Professional',
    genZ: 'Gen Z - 🔥💀 Slang',
    millennial: 'Millennial - Nostalgic',
    academic: 'Academic - Scientific',
    friendly: 'Friendly - Casual 😊',
    custom: 'Custom - Your Style',
    customPromptPlaceholder: 'Write your custom conversation style...',
    language: 'Language',
    chatTab: 'Chat',
    imageGenTab: 'Create Image',
    generate: 'Generate',
    download: 'Download',
    generatedImages: 'Generated Images',
    imagePrompt: 'Prompt',
    imageModel: 'Model',
    unsupportedFileFormat: 'Unsupported file format. Use JPG, PNG, GIF or HEIC.',
    enterPrompt: 'Please enter a prompt.',
    imageError: 'Image generation error:',
    emptyStateTitle: 'AI Mini Chat',
    emptyStateDesc: 'The most popular AI models are here. Select your model from the right and start chatting.',
  },
  zh: {
    newChat: '新对话',
    login: '登录',
    guest: '访客',
    processing: '处理中...',
    controlPanel: '控制面板',
    modeSettings: '语言和模型设置',
    aiEngine: '人工智能引擎',
    askSomething: '问点什么...',
    conversationStyle: '对话风格',
    normal: '正常 - 专业',
    genZ: 'Z世代 - 🔥💀 俚语',
    millennial: '千禧一代 - 怀旧',
    academic: '学术 - 科学',
    friendly: '友好 - 随意 😊',
    custom: '自定义 - 你的风格',
    customPromptPlaceholder: '写下你的自定义对话风格...',
    language: '语言',
    chatTab: '聊天',
    imageGenTab: '创建图片',
    generate: '生成',
    download: '下载',
    generatedImages: '生成的图片',
    imagePrompt: '提示词',
    imageModel: '模型',
    unsupportedFileFormat: '不支持的文件格式。请使用 JPG、PNG、GIF 或 HEIC。',
    enterPrompt: '请输入提示词。',
    imageError: '图片生成错误：',
    emptyStateTitle: 'AI 迷你聊天',
    emptyStateDesc: '最受欢迎的 AI 模型都在这里。从右侧选择模型并开始聊天。',
  },
  hi: {
    newChat: 'नई चैट',
    login: 'लॉग इन करें',
    guest: 'अतिथि',
    processing: 'प्रोसेसिंग...',
    controlPanel: 'कंट्रोल पैनल',
    modeSettings: 'भाषा और मॉडल सेटिंग्स',
    aiEngine: 'AI इंजन',
    askSomething: 'कुछ पूछें...',
    conversationStyle: 'बातचीत शैली',
    normal: 'सामान्य - पेशेवर',
    genZ: 'जेन Z - 🔥💀 स्लैंग',
    millennial: 'मिलेनियल - नॉस्टैल्जिक',
    academic: 'अकादमिक - वैज्ञानिक',
    friendly: 'मित्रतापूर्ण - कैजुअल 😊',
    custom: 'कस्टम - आपकी शैली',
    customPromptPlaceholder: 'अपनी कस्टम बातचीत शैली लिखें...',
    language: 'भाषा',
    chatTab: 'चैट',
    imageGenTab: 'छवि बनाएं',
    generate: 'जनरेट करें',
    download: 'डाउनलोड',
    generatedImages: 'जनरेटेड छवियां',
    imagePrompt: 'प्रॉम्प्ट',
    imageModel: 'मॉडल',
    unsupportedFileFormat: 'असमर्थित फ़ाइल प्रारूप। JPG, PNG, GIF या HEIC का उपयोग करें।',
    enterPrompt: 'कृपया एक प्रॉम्प्ट दर्ज करें।',
    imageError: 'छवि जनरेशन त्रुटि:',
    emptyStateTitle: 'AI मिनी चैट',
    emptyStateDesc: 'सबसे लोकप्रिय AI मॉडल यहां हैं। दाईं ओर से अपना मॉडल चुनें और चैटिंग शुरू करें।',
  },
  es: {
    newChat: 'Nueva Conversación',
    login: 'Iniciar Sesión',
    guest: 'Invitado',
    processing: 'Procesando...',
    controlPanel: 'Panel de Control',
    modeSettings: 'Configuración de Idioma y Modelo',
    aiEngine: 'Motor de IA',
    askSomething: 'Pregunta algo...',
    conversationStyle: 'Estilo de Conversación',
    normal: 'Normal - Profesional',
    genZ: 'Gen Z - 🔥💀 Jerga',
    millennial: 'Millennial - Nostálgico',
    academic: 'Académico - Científico',
    friendly: 'Amigable - Casual 😊',
    custom: 'Personalizado - Tu Estilo',
    customPromptPlaceholder: 'Escribe tu estilo de conversación personalizado...',
    language: 'Idioma',
    chatTab: 'Chat',
    imageGenTab: 'Crear Imagen',
    generate: 'Generar',
    download: 'Descargar',
    generatedImages: 'Imágenes Generadas',
    imagePrompt: 'Prompt',
    imageModel: 'Modelo',
    unsupportedFileFormat: 'Formato de archivo no compatible. Usa JPG, PNG, GIF o HEIC.',
    enterPrompt: 'Por favor ingresa un prompt.',
    imageError: 'Error al generar imagen:',
    emptyStateTitle: 'AI Mini Chat',
    emptyStateDesc: 'Los modelos de IA más populares están aquí. Selecciona tu modelo a la derecha y comienza a chatear.',
  },
  fr: {
    newChat: 'Nouvelle Conversation',
    login: 'Se Connecter',
    guest: 'Invité',
    processing: 'Traitement...',
    controlPanel: 'Panneau de Contrôle',
    modeSettings: 'Paramètres de Langue et Modèle',
    aiEngine: 'Moteur IA',
    askSomething: 'Posez une question...',
    conversationStyle: 'Style de Conversation',
    normal: 'Normal - Professionnel',
    genZ: 'Gen Z - 🔥💀 Argot',
    millennial: 'Millennial - Nostalgique',
    academic: 'Académique - Scientifique',
    friendly: 'Amical - Décontracté 😊',
    custom: 'Personnalisé - Votre Style',
    customPromptPlaceholder: 'Écrivez votre style de conversation personnalisé...',
    language: 'Langue',
    chatTab: 'Discussion',
    imageGenTab: 'Créer Image',
    generate: 'Générer',
    download: 'Télécharger',
    generatedImages: 'Images Générées',
    imagePrompt: 'Prompt',
    imageModel: 'Modèle',
    unsupportedFileFormat: 'Format de fichier non pris en charge. Utilisez JPG, PNG, GIF ou HEIC.',
    enterPrompt: 'Veuillez entrer un prompt.',
    imageError: "Erreur de génération d'image:",
    emptyStateTitle: 'AI Mini Chat',
    emptyStateDesc: 'Les modèles IA les plus populaires sont ici. Sélectionnez votre modèle à droite et commencez à discuter.',
  },
  ar: {
    newChat: 'محادثة جديدة',
    login: 'تسجيل الدخول',
    guest: 'ضيف',
    processing: 'جاري المعالجة...',
    controlPanel: 'لوحة التحكم',
    modeSettings: 'إعدادات اللغة والنموذج',
    aiEngine: 'محرك الذكاء الاصطناعي',
    askSomething: 'اسأل شيئاً...',
    conversationStyle: 'أسلوب المحادثة',
    normal: 'عادي - مهني',
    genZ: 'جيل Z - 🔥💀 عامية',
    millennial: 'ميلينيال - حنين',
    academic: 'أكاديمي - علمي',
    friendly: 'ودود - غير رسمي 😊',
    custom: 'مخصص - أسلوبك',
    customPromptPlaceholder: 'اكتب أسلوب المحادثة المخصص...',
    language: 'اللغة',
    chatTab: 'الدردشة',
    imageGenTab: 'إنشاء صورة',
    generate: 'إنشاء',
    download: 'تحميل',
    generatedImages: 'الصور المُنشأة',
    imagePrompt: 'النص الموجه',
    imageModel: 'النموذج',
    unsupportedFileFormat: 'تنسيق ملف غير مدعوم. استخدم JPG أو PNG أو GIF أو HEIC.',
    enterPrompt: 'الرجاء إدخال نص موجه.',
    imageError: 'خطأ في إنشاء الصورة:',
    emptyStateTitle: 'AI ميني شات',
    emptyStateDesc: 'أشهر نماذج الذكاء الاصطناعي هنا. اختر نموذجك من اليمين وابدأ الدردشة.',
  },
  bn: {
    newChat: 'নতুন চ্যাট',
    login: 'লগ ইন করুন',
    guest: 'অতিথি',
    processing: 'প্রক্রিয়াকরণ হচ্ছে...',
    controlPanel: 'কন্ট্রোল প্যানেল',
    modeSettings: 'ভাষা এবং মডেল সেটিংস',
    aiEngine: 'AI ইঞ্জিন',
    askSomething: 'কিছু জিজ্ঞাসা করুন...',
    conversationStyle: 'কথোপকথন শৈলী',
    normal: 'স্বাভাবিক - পেশাদার',
    genZ: 'জেন Z - 🔥💀 স্ল্যাং',
    millennial: 'মিলেনিয়াল - নস্টালজিক',
    academic: 'একাডেমিক - বৈজ্ঞানিক',
    friendly: 'বন্ধুত্বপূর্ণ - ক্যাজুয়াল 😊',
    custom: 'কাস্টম - আপনার শৈলী',
    customPromptPlaceholder: 'আপনার কাস্টম কথোপকথন শৈলী লিখুন...',
    language: 'ভাষা',
    chatTab: 'চ্যাট',
    imageGenTab: 'ছবি তৈরি করুন',
    generate: 'জেনারেট করুন',
    download: 'ডাউনলোড',
    generatedImages: 'জেনারেটেড ছবি',
    imagePrompt: 'প্রম্পট',
    imageModel: 'মডেল',
    unsupportedFileFormat: 'অসমর্থিত ফাইল ফরম্যাট। JPG, PNG, GIF বা HEIC ব্যবহার করুন।',
    enterPrompt: 'অনুগ্রহ করে একটি প্রম্পট লিখুন।',
    imageError: 'ছবি জেনারেশন ত্রুটি:',
    emptyStateTitle: 'AI মিনি চ্যাট',
    emptyStateDesc: 'সবচেয়ে জনপ্রিয় AI মডেলগুলি এখানে। ডান দিক থেকে আপনার মডেল নির্বাচন করুন এবং চ্যাট শুরু করুন।',
  },
  pt: {
    newChat: 'Nova Conversa',
    login: 'Entrar',
    guest: 'Visitante',
    processing: 'Processando...',
    controlPanel: 'Painel de Controle',
    modeSettings: 'Configurações de Idioma e Modelo',
    aiEngine: 'Motor de IA',
    askSomething: 'Pergunte algo...',
    conversationStyle: 'Estilo de Conversa',
    normal: 'Normal - Profissional',
    genZ: 'Gen Z - 🔥💀 Gíria',
    millennial: 'Millennial - Nostálgico',
    academic: 'Acadêmico - Científico',
    friendly: 'Amigável - Casual 😊',
    custom: 'Personalizado - Seu Estilo',
    customPromptPlaceholder: 'Escreva seu estilo de conversa personalizado...',
    language: 'Idioma',
    chatTab: 'Chat',
    imageGenTab: 'Criar Imagem',
    generate: 'Gerar',
    download: 'Baixar',
    generatedImages: 'Imagens Geradas',
    imagePrompt: 'Prompt',
    imageModel: 'Modelo',
    unsupportedFileFormat: 'Formato de arquivo não suportado. Use JPG, PNG, GIF ou HEIC.',
    enterPrompt: 'Por favor, insira um prompt.',
    imageError: 'Erro na geração de imagem:',
    emptyStateTitle: 'AI Mini Chat',
    emptyStateDesc: 'Os modelos de IA mais populares estão aqui. Selecione seu modelo à direita e comece a conversar.',
  },
  ru: {
    newChat: 'Новый Чат',
    login: 'Войти',
    guest: 'Гость',
    processing: 'Обработка...',
    controlPanel: 'Панель Управления',
    modeSettings: 'Настройки Языка и Модели',
    aiEngine: 'AI Движок',
    askSomething: 'Спросите что-нибудь...',
    conversationStyle: 'Стиль Разговора',
    normal: 'Обычный - Профессиональный',
    genZ: 'Поколение Z - 🔥💀 Сленг',
    millennial: 'Миллениал - Ностальгический',
    academic: 'Академический - Научный',
    friendly: 'Дружелюбный - Неформальный 😊',
    custom: 'Пользовательский - Ваш Стиль',
    customPromptPlaceholder: 'Напишите свой стиль разговора...',
    language: 'Язык',
    chatTab: 'Чат',
    imageGenTab: 'Создать Изображение',
    generate: 'Создать',
    download: 'Скачать',
    generatedImages: 'Созданные Изображения',
    imagePrompt: 'Промпт',
    imageModel: 'Модель',
    unsupportedFileFormat: 'Неподдерживаемый формат файла. Используйте JPG, PNG, GIF или HEIC.',
    enterPrompt: 'Пожалуйста, введите промпт.',
    imageError: 'Ошибка генерации изображения:',
    emptyStateTitle: 'AI Мини Чат',
    emptyStateDesc: 'Самые популярные модели AI здесь. Выберите модель справа и начните общение.',
  },
  ja: {
    newChat: '新しいチャット',
    login: 'ログイン',
    guest: 'ゲスト',
    processing: '処理中...',
    controlPanel: 'コントロールパネル',
    modeSettings: '言語とモデルの設定',
    aiEngine: 'AIエンジン',
    askSomething: '何か聞いてください...',
    conversationStyle: '会話スタイル',
    normal: '通常 - プロフェッショナル',
    genZ: 'Z世代 - 🔥💀 スラング',
    millennial: 'ミレニアル - ノスタルジック',
    academic: 'アカデミック - 科学的',
    friendly: 'フレンドリー - カジュアル 😊',
    custom: 'カスタム - あなたのスタイル',
    customPromptPlaceholder: 'カスタム会話スタイルを書いてください...',
    language: '言語',
    chatTab: 'チャット',
    imageGenTab: '画像を作成',
    generate: '生成',
    download: 'ダウンロード',
    generatedImages: '生成された画像',
    imagePrompt: 'プロンプト',
    imageModel: 'モデル',
    unsupportedFileFormat: 'サポートされていないファイル形式です。JPG、PNG、GIF、またはHEICを使用してください。',
    enterPrompt: 'プロンプトを入力してください。',
    imageError: '画像生成エラー:',
    emptyStateTitle: 'AI ミニチャット',
    emptyStateDesc: '最も人気のあるAIモデルがここにあります。右からモデルを選択してチャットを始めましょう。',
  },
};

// Çeviri yardımcı fonksiyonu
function t(key) {
  const translations = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS['en'];
  return translations[key] || UI_TRANSLATIONS['en'][key] || key;
}

// --- KONUŞMA STİLLERİ ---
const CONVERSATION_STYLES = {
  normal: {
    name: 'Normal',
    prompt: 'Profesyonel ve net bir şekilde konuş.',
  },
  genz: {
    name: 'Z Kuşağı',
    prompt:
      'Z kuşağı gibi konuş. Bol emoji kullan 🔥💀, kısa cümleler kur, güncel argo ve internet jargonu kullan (no cap, fr fr, based, slay gibi). Rahat ve eğlenceli ol.',
  },
  millennial: {
    name: 'Y Kuşağı',
    prompt:
      "Y kuşağı (millennial) gibi konuş. Nostaljik referanslar yap, rahat ama profesyonel ol, ara sıra 90'lar ve 2000'ler pop kültürüne atıfta bulun.",
  },
  academic: {
    name: 'Akademik',
    prompt:
      'Akademik ve bilimsel bir dil kullan. Resmi ol, detaylı açıklamalar yap, teknik terimler kullan ve kaynak gösterme alışkanlığı ol.',
  },
  friendly: {
    name: 'Samimi',
    prompt:
      'Arkadaş gibi samimi konuş. Emoji kullan 😊, espri yap, sıcak ve yakın ol. Resmiyet yapma.',
  },
  custom: {
    name: 'Özel',
    prompt: '', // Kullanıcı tarafından belirlenir
  },
};

// Mod tanımlaması (Sadece genel sohbet)
const MODES = {
  general: {
    title: 'Genel Sohbet',
    system: 'Sen zeki bir asistansın. Kısa ve öz cevaplar ver.',
    steps: ['Mesaj inceleniyor...', 'Bağlam kuruluyor...', 'Cevap üretiliyor...'],
  },
};

// --- OPTİMİZASYON: Debounce Fonksiyonu ---
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// --- OPTİMİZASYON: Intersection Observer (Lazy Loading) ---
let chatObserver = null;

function initIntersectionObserver() {
  if ('IntersectionObserver' in window) {
    chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        root: document.getElementById('chat-container'),
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }
}

// --- OPTİMİZASYON: LocalStorage Fallback ---
const Storage = {
  async save(key, data) {
    if (isUserSignedIn && typeof puter !== 'undefined') {
      try {
        await puter.fs.write(key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn('Puter.fs.write başarısız, localStorage kullanılıyor');
      }
    }
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('LocalStorage kaydetme başarısız:', e);
      return false;
    }
  },

  async load(key) {
    if (isUserSignedIn && typeof puter !== 'undefined') {
      try {
        const f = await puter.fs.read(key);
        if (f) return JSON.parse(await f.text());
      } catch (e) {
        console.warn('Puter.fs.read başarısız, localStorage kullanılıyor');
      }
    }
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('LocalStorage okuma başarısız:', e);
      return null;
    }
  },
};

// --- OPTİMİZASYON: Sessiz Error Handling ---
const isProduction = !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

function logError(error, context = '') {
  if (!isProduction) {
    console.error(`[${context}]`, error);
  }
}

// --- INIT ---
function initApp() {
  // Lucide ikonlarını başlat
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Intersection Observer'ı başlat
  initIntersectionObserver();

  // Kayıtlı ayarları yükle
  loadSettings();

  // Event listeners'ı ayarla
  setupEventListeners();

  // Kullanıcı durumunu kontrol et ve sohbetleri yükle
  initUser();

  // Arayüzü seçilen dile göre güncelle
  updateUILanguage();
}

async function initUser() {
  try {
    if (typeof puter !== 'undefined') {
      const user = await puter.auth.getUser().catch(() => null);
      if (user) {
        isUserSignedIn = true;
        document.getElementById('username').innerText = user.username;
        document.getElementById('user-avatar').innerText = user.username.charAt(0).toUpperCase();
        await loadChats();
      }
    }
  } catch (e) {
    logError(e, 'initUser');
  }

  // İlk sohbeti başlat veya mevcut olanı yükle
  if (chats.length === 0) {
    startNewChat();
  } else {
    loadChatToUI(chats[0].id);
  }
}

// --- CORE CHAT ---
async function handleSendClick() {
  const text = document.getElementById('prompt-input').value.trim();
  if (!text && !uploadedFile) return;

  document.getElementById('prompt-input').value = '';
  resizeTextarea();

  if (!activeChatId) startNewChat();
  const chatId = activeChatId;
  const currentChat = chats.find((c) => c.id === chatId);

  // Kullanıcı mesajını ekle (görsel varsa belirt)
  const userMessage = uploadedFile ? `${text} [📎 ${uploadedFile.name}]` : text;
  currentChat.messages.push({ role: 'user', content: userMessage, timestamp: Date.now() });
  updateChatUI(chatId);

  // İşleme başla
  currentChat.isProcessing = true;
  currentChat.processLog = [];
  renderHistoryList();

  const modeConfig = MODES.general; // Sadece genel mod
  const modelId = document.getElementById('model-selector').value;

  try {
    // Canlı düşünme simülasyonu
    for (const step of modeConfig.steps) {
      if (!currentChat.isProcessing) break;

      currentChat.tempStatus = step;
      currentChat.processLog.push({ text: step, done: false });

      if (activeChatId === chatId) updateThinkingUI(chatId);

      await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));

      if (currentChat.processLog.length > 0) {
        currentChat.processLog[currentChat.processLog.length - 1].done = true;
      }
    }

    // Dil ve stil prompt'larını oluştur
    const langPrompt = LANGUAGES[currentLanguage]
      ? `Lütfen ${LANGUAGES[currentLanguage].prompt} dilinde cevap ver.`
      : '';

    const stylePrompt =
      currentStyle === 'custom'
        ? customStylePrompt
        : CONVERSATION_STYLES[currentStyle]?.prompt || '';

    // API Çağrısı
    const historyContext = currentChat.messages
      .slice(-8)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    const fullPrompt = `${modeConfig.system}\n\n${langPrompt}\n\n${stylePrompt}\n\nGEÇMİŞ:\n${historyContext}\n\nUSER: ${text}`;

    let response;

    // Görsel dosyası varsa vision API kullan
    if (uploadedFile && uploadedFile.base64) {
      const messages = [
        { type: 'text', text: fullPrompt },
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: uploadedFile.type,
            data: uploadedFile.base64,
          },
        },
      ];
      response = await puter.ai.chat(messages, { model: modelId });
      clearUploadedFile();
    } else {
      response = await puter.ai.chat(fullPrompt, { model: modelId });
    }

    // API Yanıt Parsing
    let content = '';
    if (typeof response === 'string') {
      content = response;
    } else if (response?.message?.content) {
      content = response.message.content;
    } else if (response?.text) {
      content = response.text;
    } else if (response?.content) {
      content = response.content;
    } else if (response?.choices?.[0]?.message?.content) {
      content = response.choices[0].message.content;
    } else if (typeof response === 'object') {
      content = JSON.stringify(response, null, 2);
    } else {
      content = String(response);
    }

    if (Array.isArray(content)) {
      content = content
        .map((c) => (typeof c === 'object' ? c.text || JSON.stringify(c) : c))
        .join('');
    }

    currentChat.messages.push({ role: 'assistant', content: content, timestamp: Date.now() });
  } catch (err) {
    logError(err, 'handleSendClick');
    currentChat.messages.push({
      role: 'assistant',
      content: `⚠️ Hata: ${err.message || 'Bağlantı koptu.'}`,
    });
  } finally {
    currentChat.isProcessing = false;
    currentChat.tempStatus = null;
    saveChats();
    renderHistoryList();
    if (activeChatId === chatId) updateChatUI(chatId);
  }
}

// --- UI GÜNCELLEME FONKSİYONLARI ---
function updateChatUI(chatId) {
  if (chatId !== activeChatId) return;

  const chat = chats.find((c) => c.id === chatId);
  const container = document.getElementById('messages-list');
  container.innerHTML = '';
  document.getElementById('empty-state').style.display = chat.messages.length ? 'none' : 'flex';
  document.getElementById('chat-header-title').innerText = chat.title || t('newChat');

  // Mesajları render et
  chat.messages.forEach((msg) => {
    const div = document.createElement('div');
    const isUser = msg.role === 'user';
    div.className = `flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;

    const avatarBg = isUser ? 'bg-[#3b52d4]' : 'bg-[#2b2e40] border border-[#2f3345]';
    const icon = isUser ? 'user' : 'bot';

    let contentHtml = marked.parse(msg.content);

    div.innerHTML = `
      <div class="w-8 h-8 rounded-full ${avatarBg} flex-shrink-0 flex items-center justify-center text-white text-xs shadow-lg"><i data-lucide="${icon}" class="w-4 h-4"></i></div>
      <div class="max-w-[85%] min-w-0">
        <div class="p-4 rounded-2xl ${isUser ? 'bg-[#3b52d4] text-white' : 'bg-[#1e2130] text-gray-100 border border-[#2f3345]'} shadow-md markdown-body">
          ${contentHtml}
        </div>
        <div class="text-[10px] text-gray-600 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'} opacity-60">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
    container.appendChild(div);
  });

  // İşleme göstergesi
  if (chat.isProcessing) {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = 'thinking-bubble';
    thinkingDiv.className = 'flex gap-4';
    thinkingDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-[#2b2e40] flex-shrink-0 flex items-center justify-center text-gray-300 text-xs border border-[#2f3345] animate-pulse"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i></div>
      <div class="max-w-[85%] min-w-0">
        <div class="p-0 rounded-2xl">
          <div class="thinking-process rounded-lg border border-[#2f3345] bg-[#151722] p-3 shadow-inner" id="thinking-steps-container">
          </div>
        </div>
      </div>
    `;
    container.appendChild(thinkingDiv);
    updateThinkingUI(chatId);
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  requestAnimationFrame(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  });
}

function updateThinkingUI(chatId) {
  const container = document.getElementById('thinking-steps-container');
  if (!container) return;

  const chat = chats.find((c) => c.id === chatId);
  if (!chat || !chat.processLog) return;

  container.innerHTML = chat.processLog
    .map((log, index) => {
      const isActive = index === chat.processLog.length - 1;
      const icon = log.done ? 'check-circle' : isActive ? 'loader' : 'circle';
      const color = log.done
        ? 'text-green-500'
        : isActive
          ? 'text-blue-400 animate-pulse'
          : 'text-gray-600';
      const spin = isActive && !log.done ? 'animate-spin' : '';

      return `
        <div class="thinking-step ${isActive ? 'active' : ''}">
          <i data-lucide="${icon}" class="${color} ${spin} w-3 h-3"></i>
          <span>${log.text}</span>
        </div>
      `;
    })
    .join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// --- SOHBET YÖNETİMİ FONKSİYONLARI ---
function startNewChat() {
  const id = Date.now().toString();

  const newChat = {
    id: id,
    title: t('newChat'),
    messages: [],
    mode: 'general',
    timestamp: Date.now(),
    isProcessing: false,
    processLog: [],
  };
  chats.unshift(newChat);
  loadChatToUI(id);
  renderHistoryList();
  saveChats();

  // Mobilde sol sidebar'ı kapat
  if (window.innerWidth < 768) {
    document.getElementById('sidebar-left').classList.add('-translate-x-full');
  }
}

function loadChatToUI(id) {
  activeChatId = id;
  const chat = chats.find((c) => c.id === id);
  if (!chat) return;

  updateChatUI(id);
  renderHistoryList();
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  list.innerHTML = '';

  chats.forEach((chat) => {
    const isActive = chat.id === activeChatId;
    const btn = document.createElement('button');
    btn.onclick = () => loadChatToUI(chat.id);

    const processingBadge = chat.isProcessing
      ? `<div class="absolute right-3 top-3 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div><div class="absolute right-3 top-3 w-2 h-2 bg-blue-500 rounded-full"></div>`
      : '';

    btn.className = `w-full text-left p-3 rounded-xl text-sm mb-1 flex items-center gap-3 relative transition-all group border border-transparent
      ${isActive ? 'bg-[#1e2130] border-[#2f3345] text-white shadow-md' : 'text-gray-400 hover:bg-[#151722] hover:text-gray-200'}`;

    btn.innerHTML = `
      <i data-lucide="message-circle" class="w-4 h-4 opacity-60"></i>
      <div class="flex-1 min-w-0">
        <div class="truncate font-medium text-[13px]">${chat.title}</div>
        <div class="text-[10px] opacity-50 truncate">${chat.isProcessing ? chat.tempStatus || t('processing') : new Date(chat.timestamp).toLocaleDateString()}</div>
      </div>
      ${processingBadge}
    `;
    list.appendChild(btn);
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// --- YARDIMCI FONKSİYONLAR ---
async function handleAuth() {
  try {
    if (typeof puter !== 'undefined') {
      const user = await puter.auth.signIn();
      isUserSignedIn = true;
      document.getElementById('username').innerText = user.username;
      document.getElementById('user-avatar').innerText = user.username.charAt(0).toUpperCase();
      await loadChats();
    }
  } catch (e) {
    logError(e, 'handleAuth');
  }
}

async function saveChats() {
  await Storage.save('chats_mini_v1.json', chats);
}

async function loadChats() {
  const data = await Storage.load('chats_mini_v1.json');
  if (data) {
    chats = data;
    renderHistoryList();
  }
}

// Textarea boyutlandırma
function resizeTextarea() {
  const el = document.getElementById('prompt-input');
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

const debouncedResizeTextarea = debounce(resizeTextarea, 50);

// Sidebar toggle fonksiyonları
function toggleLeftSidebar() {
  document.getElementById('sidebar-left').classList.toggle('-translate-x-full');
}

function toggleRightSidebar() {
  document.getElementById('sidebar-right').classList.toggle('translate-x-full');
}

// --- AYARLARI KAYDET/YÜKLE ---
function saveSettings() {
  const settings = {
    language: currentLanguage,
    style: currentStyle,
    customStylePrompt: customStylePrompt,
  };
  localStorage.setItem('ai_mini_settings', JSON.stringify(settings));
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('ai_mini_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      currentLanguage = settings.language || 'tr';
      currentStyle = settings.style || 'normal';
      customStylePrompt = settings.customStylePrompt || '';
    }
  } catch (e) {
    logError(e, 'loadSettings');
  }
}

// --- DİL DEĞİŞTİRME ---
function setLanguage(lang) {
  if (LANGUAGES[lang]) {
    currentLanguage = lang;
    saveSettings();
    updateUILanguage();
  }
}

function updateUILanguage() {
  // Dil seçiciyi güncelle
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = currentLanguage;
  }

  // Stil seçiciyi güncelle
  const styleSelector = document.getElementById('style-selector');
  if (styleSelector) {
    styleSelector.value = currentStyle;
  }

  // Özel stil textarea'sını güncelle
  const customStyleTextarea = document.getElementById('custom-style-prompt');
  if (customStyleTextarea) {
    customStyleTextarea.value = customStylePrompt;
    customStyleTextarea.style.display = currentStyle === 'custom' ? 'block' : 'none';
  }

  // Arayüz metinlerini güncelle
  const elements = {
    'new-chat-btn-text': t('newChat'),
    'auth-btn-text': t('login'),
    'control-panel-title': t('controlPanel'),
    'control-panel-desc': t('modeSettings'),
    'ai-engine-label': t('aiEngine'),
    'prompt-input': { placeholder: t('askSomething') },
    'conversation-style-label': t('conversationStyle'),
    'language-label': t('language'),
    'chat-tab-text': t('chatTab'),
    'image-tab-text': t('imageGenTab'),
    'generate-btn-text': t('generate'),
    'generated-images-title': t('generatedImages'),
    'image-prompt-label': t('imagePrompt'),
    'image-model-label': t('imageModel'),
    'empty-state-desc': t('emptyStateDesc'),
  };

  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([attr, val]) => {
          el.setAttribute(attr, val);
        });
      } else {
        el.innerText = value;
      }
    }
  });

  // Stil seçici seçeneklerini güncelle
  updateStyleSelectorOptions();
}

function updateStyleSelectorOptions() {
  const styleSelector = document.getElementById('style-selector');
  if (!styleSelector) return;

  const options = styleSelector.options;
  if (options.length >= 6) {
    options[0].text = t('normal');
    options[1].text = t('genZ');
    options[2].text = t('millennial');
    options[3].text = t('academic');
    options[4].text = t('friendly');
    options[5].text = t('custom');
  }

  // Custom placeholder'ı güncelle
  const customStyleTextarea = document.getElementById('custom-style-prompt');
  if (customStyleTextarea) {
    customStyleTextarea.placeholder = t('customPromptPlaceholder');
  }
}

// --- KONUŞMA STİLİ DEĞİŞTİRME ---
function setStyle(style) {
  currentStyle = style;
  saveSettings();

  const customStyleTextarea = document.getElementById('custom-style-prompt');
  if (customStyleTextarea) {
    customStyleTextarea.style.display = style === 'custom' ? 'block' : 'none';
  }
}

function setCustomStylePrompt(prompt) {
  customStylePrompt = prompt;
  saveSettings();
}

// --- DOSYA YÜKLEME (SADECE RESİM) ---
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/heic'];

  if (!allowedTypes.includes(file.type)) {
    alert(t('unsupportedFileFormat'));
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result.split(',')[1];
    uploadedFile = {
      name: file.name,
      type: file.type,
      base64: base64,
    };
    showFilePreview(file, e.target.result);
  };
  reader.readAsDataURL(file);
}

function showFilePreview(file, dataUrl) {
  const previewContainer = document.getElementById('file-preview-container');
  if (!previewContainer) return;

  previewContainer.classList.remove('hidden');

  previewContainer.innerHTML = `
    <div class="flex items-center gap-2 bg-[#1e2130] p-2 rounded-lg border border-[#2f3345]">
      <img src="${dataUrl}" alt="Preview" class="w-16 h-16 object-cover rounded-lg">
      <div class="flex-1 min-w-0">
        <div class="text-xs text-white truncate">${file.name}</div>
        <div class="text-[10px] text-gray-500">${(file.size / 1024).toFixed(1)} KB</div>
      </div>
      <button onclick="clearUploadedFile()" class="p-1 hover:bg-red-500/20 rounded text-red-400">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
  `;

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function clearUploadedFile() {
  uploadedFile = null;
  const previewContainer = document.getElementById('file-preview-container');
  if (previewContainer) {
    previewContainer.classList.add('hidden');
    previewContainer.innerHTML = '';
  }
  const fileInput = document.getElementById('file-upload-input');
  if (fileInput) {
    fileInput.value = '';
  }
}

// --- RESİM OLUŞTURMA (NANO BANANA) ---
async function generateImage() {
  const promptInput = document.getElementById('image-prompt');
  const modelSelect = document.getElementById('image-model-selector');
  const generateBtn = document.getElementById('generate-image-btn');
  const gallery = document.getElementById('image-gallery');

  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert(t('enterPrompt'));
    return;
  }

  const model = modelSelect.value;
  const originalBtnText = generateBtn.innerHTML;

  generateBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> ${t('generate')}...`;
  generateBtn.disabled = true;

  try {
    const response = await puter.ai.txt2img(prompt, { model: model });

    let imageUrl = '';
    if (typeof response === 'string') {
      imageUrl = response;
    } else if (response?.url) {
      imageUrl = response.url;
    } else if (response?.image) {
      imageUrl = response.image;
    } else if (response?.data) {
      imageUrl = `data:image/png;base64,${response.data}`;
    }

    if (imageUrl) {
      const imageCard = document.createElement('div');
      imageCard.className =
        'relative group rounded-xl overflow-hidden border border-[#2f3345] bg-[#1e2130]';
      imageCard.innerHTML = `
        <img src="${imageUrl}" alt="${prompt}" class="w-full aspect-square object-cover">
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <a href="${imageUrl}" download="ai-mini-${Date.now()}.png" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <i data-lucide="download" class="w-5 h-5 text-white"></i>
          </a>
        </div>
        <div class="p-2 text-xs text-gray-400 truncate">${prompt}</div>
      `;
      gallery.prepend(imageCard);

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    promptInput.value = '';
  } catch (err) {
    logError(err, 'generateImage');
    alert(`${t('imageError')} ${err.message}`);
  } finally {
    generateBtn.innerHTML = originalBtnText;
    generateBtn.disabled = false;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// --- SEKME DEĞİŞTİRME ---
function switchTab(tab) {
  activeTab = tab;

  const chatTab = document.getElementById('chat-tab-content');
  const imageTab = document.getElementById('image-tab-content');
  const chatTabBtn = document.getElementById('chat-tab-btn');
  const imageTabBtn = document.getElementById('image-tab-btn');

  if (tab === 'chat') {
    chatTab?.classList.remove('hidden');
    imageTab?.classList.add('hidden');
    chatTabBtn?.classList.add('active', 'border-b-2', 'border-blue-500');
    chatTabBtn?.classList.remove('text-gray-500');
    imageTabBtn?.classList.remove('active', 'border-b-2', 'border-blue-500');
    imageTabBtn?.classList.add('text-gray-500');
  } else {
    chatTab?.classList.add('hidden');
    imageTab?.classList.remove('hidden');
    imageTabBtn?.classList.add('active', 'border-b-2', 'border-blue-500');
    imageTabBtn?.classList.remove('text-gray-500');
    chatTabBtn?.classList.remove('active', 'border-b-2', 'border-blue-500');
    chatTabBtn?.classList.add('text-gray-500');
  }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  const promptInput = document.getElementById('prompt-input');

  if (promptInput) {
    promptInput.addEventListener('input', debouncedResizeTextarea);
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendClick();
      }
    });
  }

  // Dil seçici
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Stil seçici
  const styleSelector = document.getElementById('style-selector');
  if (styleSelector) {
    styleSelector.addEventListener('change', (e) => {
      setStyle(e.target.value);
    });
  }

  // Özel stil prompt textarea
  const customStyleTextarea = document.getElementById('custom-style-prompt');
  if (customStyleTextarea) {
    customStyleTextarea.addEventListener('input', (e) => {
      setCustomStylePrompt(e.target.value);
    });
  }

  // Dosya yükleme input
  const fileInput = document.getElementById('file-upload-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Resim oluşturma butonu
  const generateBtn = document.getElementById('generate-image-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateImage);
  }

  // Resim prompt'u için Enter tuşu
  const imagePrompt = document.getElementById('image-prompt');
  if (imagePrompt) {
    imagePrompt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateImage();
      }
    });
  }
}

// DOM hazır olduğunda uygulamayı başlat
document.addEventListener('DOMContentLoaded', initApp);
