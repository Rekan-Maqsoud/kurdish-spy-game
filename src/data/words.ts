import { Category, CategoryId } from '../types';
import Colors from '../constants/colors';

// شوێنەکان - Places (natural Kurdish words)
const places: string[] = [
  'ماڵ', 'خانوو', 'حەوش', 'باخچە', 'گەڕەک',
  'شەقام', 'کۆڵان', 'بازاڕ', 'دووکان', 'سوپەرمارکێت',
  'نانەوا', 'میوەفرۆش', 'قەساب', 'چێشتخانە', 'قاوەخانە',
  'چایخانە', 'کافێ', 'مۆڵ', 'پارک', 'یاریگا',
  'قوتابخانە', 'زانکۆ', 'کتێبخانە', 'مزگەوت', 'کڵێسا',
  'نەخۆشخانە', 'دەرمانخانە', 'پۆلیسخانە', 'بانک', 'پۆستخانە',
  'دادگا', 'سینەما', 'هۆتێل', 'کارگە', 'فابریکە',
  'وێستگە', 'ئۆتۆبۆسخانە', 'تاکسی وێستگە', 'فڕۆکەخانە', 'پەترۆلخانە',
  'شار', 'گوند', 'پرد', 'دەرگا', 'پەنجەڕە',
  'دەریا', 'ساحڵ', 'کەنار', 'چیا', 'ڕووبار',
  'دارستان', 'دەشت', 'شەڵاڵە', 'گۆڕستان',
];

// خۆراک - Food (common everyday food words)
const food: string[] = [
  'نان', 'برنج', 'پڵاو', 'گۆشت', 'مریشک',
  'ماسی', 'هێلکە', 'پەنیر', 'ماست', 'شیر',
  'قەیماخ', 'کەرە', 'مربا', 'شەکر', 'نمک',
  'تەماتە', 'پیاز', 'سیر', 'خەیار', 'کاهو',
  'پەتاتە', 'گێزەر', 'کەلەم', 'بادمجان', 'بیبەر',
  'سپانەخ', 'لوبیا', 'نۆخود', 'باقلا', 'قارچ',
  'سەڵاتە', 'تورشی', 'زەیتوون', 'سۆس',
  'کەباب', 'بریانی', 'دۆڵمە', 'شۆربا', 'کوفتە',
  'فەلافل', 'شاورما', 'ساندویچ', 'بەرگەر', 'پیتزا',
  'کێک', 'بسکویت', 'شیرینی', 'بەقلاوە', 'کولێچە',
  'سێو', 'پرتەقاڵ', 'مۆز', 'هەنار', 'انگور',
  'لیمۆ', 'تووت', 'فڕاولە', 'گێلاس', 'خوخ',
  'قەیسی', 'خورما', 'ئەنجیر', 'هەرمێ', 'شمام',
  'گوێز', 'بادەم', 'جەوز', 'فستق',
];

// ئاژەڵەکان - Animals
const animals: string[] = [
  'سەگ', 'پشیلە', 'مشک', 'ئەسپ', 'گوێدرێژ',
  'مانگا', 'مەڕ', 'بزن', 'بەراز',
  'شێر', 'پڵنگ', 'گورگ', 'ڕێوی', 'ورچ',
  'خرگۆش', 'ئاهوو', 'چەقەڵ',
  'مار', 'سوسمار', 'قورباخە',
  'ماسی', 'دۆڵفین', 'نەهەنگ',
  'مریشک', 'کۆتر', 'قاز', 'ئۆردەک', 'چووچکە',
  'قەلاغ', 'بلبل', 'باز', 'هەڵۆ',
  'مێش', 'مێگەز', 'مێروو', 'هەنگ', 'پەپوولە',
];

// گواستنەوە - Transport
const transport: string[] = [
  'سەیارە', 'تاکسی', 'باس', 'مینیبۆس', 'پاس',
  'پاسکیل', 'موتۆر', 'سکوتەر',
  'قطار', 'فڕۆکە', 'هەلیکۆپتەر',
  'کەشتی', 'بەلەم', 'قایق',
  'ئەمبولانس', 'ئاگرکوژێنەوە',
];

// وەرزش - Sports
const sports: string[] = [
  'تۆپی پێ', 'باسکەتبۆڵ', 'ڤۆلیبۆڵ', 'تێنس', 'بادمینتۆن',
  'بۆکس', 'کوشتی', 'جودۆ', 'کاراتێ', 'تایکواندۆ',
  'مەلەوانی', 'ڕاکردن', 'پەڕین', 'یۆگا',
  'بیلیارد', 'شەتڕەنج',
];

// پیشەکان - Jobs/Professions
const professions: string[] = [
  'دکتۆر', 'پەرستار', 'داروساز',
  'مامۆستا', 'قوتابی',
  'پۆلیس', 'سەرباز', 'ئاگرکوژێنەوە',
  'شۆفێر', 'مەکانیک',
  'فرۆشیار', 'بازرگان', 'کارگەر', 'وەستا',
  'نانەوا', 'قەساب', 'سەرتاش', 'خەیات', 'نەجار',
  'گارسۆن', 'چێشتیار', 'کوافێر',
  'فۆتۆگراف', 'نووسەر', 'ڕۆژنامەوان',
  'پرۆگرامەر', 'دیزاینەر', 'ئەندازیار', 'پارێزەر',
];

// شتومەکەکان - Objects
const objects: string[] = [
  'کتێب', 'قەڵەم', 'دەفتەر',
  'مۆبایل', 'کۆمپیوتەر', 'لاپتۆپ', 'چارجەر',
  'عەینەک', 'کاتژمێر',
  'جانتا', 'پاکەت',
  'کلیل', 'قوفڵ',
  'قاپ', 'گلاس', 'پیالە', 'سینی',
  'چەقۆ', 'چەمچە', 'چەتاڵ',
  'قەیچی', 'فرچە', 'صابوون', 'دستمال',
  'چرا', 'لامپ',
  'کاغەز',
];

// سروشت - Nature
const nature: string[] = [
  'دار', 'گوڵ', 'گیا', 'بەرگ', 'خاک',
  'بەرد', 'چیا', 'دۆڵ', 'دەشت', 'دارستان',
  'دەریا', 'ڕووبار', 'گۆڵ', 'کانیاو', 'شەڵاڵە',
  'باران', 'بەفر', 'هەور', 'خۆر', 'مانگ',
  'ئەستێرە', 'ئاسمان', 'با', 'بروسکە',
  'ڕۆژ', 'شەو', 'سبەی', 'ئێوارە',
  'هاوین', 'زستان', 'بەهار', 'پاییز',
  'گەرما', 'ساردی', 'هەوا', 'ئاو', 'ئاگر',
];

// جلوبەرگ - Clothes
const clothes: string[] = [
  'کراس', 'شەرواڵ', 'پانتۆڵ',
  'تی‌شێرت', 'هوودی', 'سویتەر', 'جاکێت', 'پاڵتۆ',
  'فانێلە', 'شۆرت',
  'پێڵاو', 'بووت',
  'کڵاو', 'شاڵ', 'جۆراو', 'دەسکێش',
  'قایش', 'کەمەر',
  'پیژامە', 'جلی وەرزشی',
];

// ئەندامەکانی جەستە - Body Parts
const bodyParts: string[] = [
  'سەر', 'قژ', 'ڕوو', 'چاو', 'بڕۆ',
  'لووت', 'دەم', 'لێو', 'ددان', 'زمان',
  'گوێ', 'مل', 'گەردن', 'شان', 'سنگ',
  'دڵ', 'زگ', 'پشت',
  'دەست', 'پەنجە',
  'قاچ', 'ئەژنۆ',
  'پێ', 'نینۆک',
];

// ئامێرە ئەلیکترۆنییەکان - Electronics
const electronics: string[] = [
  'مۆبایل', 'تابلێت', 'لاپتۆپ', 'کۆمپیوتەر',
  'تەلەڤزیۆن', 'ڕادیۆ', 'سپیکەر', 'هێدفۆن',
  'کیبۆرد', 'ماوس', 'مۆنیتەر',
  'چارجەر', 'باتری', 'کەیبڵ',
  'ڕاوتەر', 'کامێرا', 'پرینتەر',
  'پلەیستەیشن', 'ئێکسبۆکس',
  'ڕیمۆت',
];

// کەلوپەلی ماڵ - Furniture
const furniture: string[] = [
  'مێز', 'کورسی', 'سۆفە', 'تەخت', 'دۆشەک',
  'باڵیفە', 'لحاف', 'پەردە', 'فەرش', 'خاڵیچە',
  'کۆمۆد', 'ڕەف', 'سندوق', 'ئاوێنە', 'گڵدان',
];

// وڵاتەکان - Countries
const countries: string[] = [
  'کوردستان', 'عێراق', 'ئێران', 'تورکیا', 'سووریا',
  'سعوودی', 'ئیمارات', 'قەتەر', 'کوەیت',
  'ئەمریکا', 'کەنەدا', 'بەریتانیا', 'فەڕەنسا', 'ئەڵمانیا',
  'ئیتالیا', 'ئیسپانیا', 'سوید', 'هۆڵەندا', 'ڕووسیا',
  'چین', 'ژاپۆن', 'هیندستان', 'پاکستان',
  'برازیل', 'ئوسترالیا',
];

// ڕەنگەکان - Colors
const colors: string[] = [
  'سوور', 'شین', 'زەرد', 'سەوز', 'کەسک',
  'سپی', 'ڕەش', 'پەمەیی', 'مۆر', 'پرتەقاڵی',
  'قاوەیی', 'بۆر', 'خۆڵەمێشی', 'ئاسمانی', 'زەیتوونی',
  'ئاڵتوونی', 'زیو', 'نیلی', 'گەش', 'تاریک',
];

// خواردنەوەکان - Drinks
const drinks: string[] = [
  'ئاو', 'چا', 'قاوە', 'شیر', 'ئایران',
  'شەربەت', 'لیمۆناتە', 'شیری مۆز',
  'نەسکافێ', 'کاپۆچینۆ', 'چای سەوز', 'کاکاو',
  'عەسیر', 'سموودی',
  'نوشابە',
];

// Export all categories
export const categories: Category[] = [
  {
    id: 'places',
    name: 'شوێنەکان',
    icon: 'location',
    color: Colors.categories.places,
    words: places,
  },
  {
    id: 'food',
    name: 'خواردن',
    icon: 'fast-food',
    color: Colors.categories.food,
    words: food,
  },
  {
    id: 'animals',
    name: 'ئاژەڵ',
    icon: 'paw',
    color: Colors.categories.animals,
    words: animals,
  },
  {
    id: 'transport',
    name: 'گواستنەوە',
    icon: 'car',
    color: Colors.categories.transport,
    words: transport,
  },
  {
    id: 'sports',
    name: 'وەرزش',
    icon: 'football',
    color: Colors.categories.sports,
    words: sports,
  },
  {
    id: 'professions',
    name: 'پیشە',
    icon: 'briefcase',
    color: Colors.categories.professions,
    words: professions,
  },
  {
    id: 'objects',
    name: 'شتەکان',
    icon: 'cube',
    color: Colors.categories.objects,
    words: objects,
  },
  {
    id: 'nature',
    name: 'سروشت',
    icon: 'leaf',
    color: Colors.categories.nature,
    words: nature,
  },
  {
    id: 'clothes',
    name: 'جل و بەرگ',
    icon: 'shirt',
    color: Colors.categories.clothes,
    words: clothes,
  },
  {
    id: 'bodyParts',
    name: 'ئەندامی جەستە',
    icon: 'body',
    color: Colors.categories.bodyParts,
    words: bodyParts,
  },
  {
    id: 'electronics',
    name: 'ئەلیکترۆنیات',
    icon: 'phone-portrait',
    color: Colors.categories.electronics,
    words: electronics,
  },
  {
    id: 'furniture',
    name: 'کەلوپەل',
    icon: 'bed',
    color: Colors.categories.furniture,
    words: furniture,
  },
  {
    id: 'countries',
    name: 'وڵات',
    icon: 'globe',
    color: Colors.categories.places,
    words: countries,
  },
  {
    id: 'colors',
    name: 'ڕەنگ',
    icon: 'color-palette',
    color: Colors.categories.objects,
    words: colors,
  },
  {
    id: 'drinks',
    name: 'خواردنەوە',
    icon: 'cafe',
    color: Colors.categories.food,
    words: drinks,
  },
];

// Get total word count
export const getTotalWordCount = (): number => {
  return categories.reduce((total, category) => total + category.words.length, 0);
};

// Get words from selected categories
export const getWordsFromCategories = (categoryIds: CategoryId[]): string[] => {
  return categories
    .filter(cat => categoryIds.includes(cat.id))
    .flatMap(cat => cat.words);
};

// Get random word from categories
export const getRandomWord = (categoryIds: CategoryId[], usedWords: string[] = []): { word: string; categoryId: CategoryId } | null => {
  const availableCategories = categories.filter(cat => categoryIds.includes(cat.id));
  if (availableCategories.length === 0) return null;

  const allWords: { word: string; categoryId: CategoryId }[] = [];
  availableCategories.forEach(cat => {
    cat.words.forEach(word => {
      if (!usedWords.includes(word)) {
        allWords.push({ word, categoryId: cat.id });
      }
    });
  });

  if (allWords.length === 0) return null;
  return allWords[Math.floor(Math.random() * allWords.length)];
};

// Get category by ID
export const getCategoryById = (id: CategoryId): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

// Get random words for spy guess options
export const getSpyGuessOptions = (
  correctWord: string,
  categoryId: CategoryId,
  numberOfOptions: number
): string[] => {
  const category = getCategoryById(categoryId);
  if (!category) return [correctWord];

  const otherWords = category.words.filter(w => w !== correctWord);
  const shuffled = otherWords.sort(() => Math.random() - 0.5);
  const options = shuffled.slice(0, numberOfOptions - 1);
  options.push(correctWord);
  
  // Shuffle the options including correct word
  return options.sort(() => Math.random() - 0.5);
};

export default categories;
