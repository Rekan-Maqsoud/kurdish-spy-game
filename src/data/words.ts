import { Category, CategoryId } from '../types';
import Colors from '../constants/colors';

// شوێنەکان - Places (natural Kurdish words)
const places: string[] = [
  'ماڵ', 'ماڵی باپیر', 'حەوشە', 'باخچە', 'گەڕەک',
  'شەقام', 'کۆڵان', 'بازاڕ', 'دووکان', 'سوپەرمارکێت',
  'نانەوا', 'میوەفرۆش', 'چێشتخانە', 'نەمامگە و مەشتەل',
  'چایخانە', 'کافێ', 'مۆڵ', 'پارک', 'یاریگا',
  'قوتابخانە', 'زانکۆ', 'کتێبخانە', 'مزگەوت', 'کڵێسا',
  'نەخۆشخانە', 'دەرمانخانە', 'پۆلیسخانە', 'بانک', 'بەندینخانە',
  'دادگا', 'سینەما', 'هۆتێل', 'کارگە', 'ئاکرێ',
  'وێستگە', 'پرژێ', 'تاکسی وێستگە', 'فڕۆکەخانە', ' ',
  'شار', 'گوند', 'پرد', 'دەرگا', 'سەربان',
  'دەریا', 'کۆلێژ', 'کەنار', 'چیا', 'ڕووبار',
  ' دارستان', 'دەشت',
  'گەلی عەلی بەگ ',
  'بێخاڵ',
  'هەڵگورد', 'سەهۆڵەکە', 'گۆڕستان', 'لەنگە'
];

// خۆراک - Food (common everyday food words)
const food: string[] = [
  'نان', 'برنجی کوردی', 'قوراو', 'گۆشت', 'مریشک',
  'ماسی', 'هێلکە', 'پەنیر', 'ماست', 'شیر',
  'قەیماخ', 'کەرە', 'مرەبا', 'شەکر', 'نیسک',
  'تەماتە', 'پیاز', 'سیر', 'خەیار', 'کاهو',
  'پەتاتە', 'گێزەر', 'کەلەرم', 'باینجان', 'بیبەر',
  'سپێناخ', 'لۆبیا', 'بەهارات', 'پاقلە', 'قارچک',
  'زەڵاتە', 'تورشی', 'زەیتوون', 'سۆس',
  'کەباب', 'بریانی', 'دۆڵمە', 'شۆربا', 'کفتە',
  'فەلافل', 'شاورما', 'لەفە', 'بەرگەر', 'پیتزا',
  'کێک', 'دۆندرمە', 'شیرینی', 'پاقلاوە', 'کولیچە',
  'سێو', 'پرتەقاڵ', 'مۆز', 'هەنار', 'مانگۆ',
  'لیمۆ', 'نۆتێلا', 'فڕاولە', 'گێلاس', 'خوخ',
  'قەیسی', 'خورما', 'هەنجیر', 'هەرمێ', 'تەماتەورون',
  'گوێز', 'بادەم', 'جەوز', 'فستق', ' تێکشە', 'تەشریب ',
  'سەروپێ', 'شفتە', 'لۆر', 'ترخێنە', 'قۆزی', 'کریپ', 'خورما', 'مەعکەڕۆنی', ' چەقەلە', ' کوبە',
];

// ئاژەڵەکان - Animals
const animals: string[] = [
  'سەگ', 'پشیلە', 'مشک', 'ئەسپ', 'گوێدرێژ',
  'مانگا', 'مەڕ', 'بزن', 'بەراز',
  'شێر', 'پڵنگ', 'گورگ', 'ڕێوی', 'ورچ',
    'چەقەڵ',
  'مار', 'سوسکە',
  'ماسی', 'دۆڵفین', 'نەهەنگ',
  'مریشک', 'کۆتر', 'قاز','جووجکە',
'مەیمون',  'بلبل', 'هەڵۆ',
'بۆق','ئەستێرەی دەریا','کەندەپەپۆ','ژیژک','کەروێشک','مامز','کیسەڵ','گۆرێلە','کەنغەر','زەڕافە','پاندا','فیل','کەرەکێوی','کوالا',  'مێش',  'مێروو', 'هەنگ', 'پەپوولە',
];

// گواستنەوە - Transport
const transport: string[] = [
  'سەیارە', 'تاکسی', 'پاس', 'مینیپاس',
  'پاسکیل', 'ماتۆڕ', 'سکۆتەر',
  'شەمەندەفەر', 'فڕۆکە', 'هەلیکۆپتەر',
  'کەشتی', 'بەلەم',
  'ئۆتۆمبێلی فریاکەوتن', 'ئاگرکوژێنەوە',
];

// وەرزش - Sports
const sports: string[] = [
  'تۆپی پێ', 'تۆپیسەلە', 'بالە', 'تێنس', 'بادمینتۆن',
  'شەرەمست', 'جودۆ', 'کاراتی', 'تایکواندۆ',
  'مەلەوانی', 'ڕاکردن', 'بازی بەرز', 'یۆگا',
'پێشبڕکێی ئۆتۆمبێل', 'بیلیارد', 'شەتڕەنج',
];

// پیشەکان - Jobs/Professions
const professions: string[] = [
  'دکتۆر', 'پەرستار', 'دارتاش',
  'مامۆستا', 'قوتابی',
  'پۆلیس', 'سەرباز', 'ئاگرکوژێنەوە',
  'شۆفێر', 'فیتەر',
  'فرۆشیار', 'بازرگان', 'کرێکار', 'وەستا',
  'نانەوا', 'گۆشت فرۆش', 'سەرتاش', 'خەیات',
  'شاگرد', 'چێشتلێنەر', 
  'وێنەگر', 'نووسەر', 'ڕۆژنامەنوس',
  'پرۆگرامساز', 'دیزاینەر', 'ئەندازیار', 'پارێزەر',
];

// شتومەکەکان - Objects
const objects: string[] = [
  'کتێب', 'پێنووس', 'تێنووس',
  'چاویلکە', 'کاتژمێر',
  'جانتا', 'پاکەت',
  'کلیل', 'قوفڵ',
  'قاپ', 'گلاس', 'پیالە', 'سینی',
  'چەقۆ', 'چەمچە', 'چەتاڵ',
  'فرچە', 'صابوون', 'دەستمال',
  'فانۆس', 
'جەرنافیس','ئیسپانە',  'کاغەز',
];

// سروشت - Nature
const nature: string[] = [
  'دار', 'گوڵ', 'گیا', 'خاک',
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
  'تی‌شێرت', 'هوودی',  'چاکەت', 'پانتۆڵ',
  'فانیلە', 'شۆرت',
  'پێڵاو', 
  'کڵاو', 'شاڵ', 'گۆرەوی', 'دەسکێش',
  'قایش', 
  'جلی وەرزشی',
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
  'پاتری', 'کەیبڵ',
  'ڕاوتەر', 'کامێرا', 'پرینتەر',
  'پلەیستەیشن', 'ئێکسبۆکس',
];

// کەلوپەلی ماڵ - Furniture
const furniture: string[] = [
  'مێز', 'کورسی', 'سۆفە', 'تەختە', 'دۆشەک',
  'بالیف',  'پەردە', 'فەرش', 
   'ڕەف', 'سندوق', 'ئاوێنە', 'گوڵدان',
];

// وڵاتەکان - Countries
const countries: string[] = [
  'کوردستان', 'عێراق', 'ئێران', 'تورکیا', 'سووریا',
  'سعودیا', 'ئیمارات', 'قەتەر', 'کوەیت',
  'ئەمریکا', 'کەنەدا', 'بەریتانیا', 'فەڕەنسا', 'ئەڵمانیا',
  'ئیتاڵیا', 'ئیسپانیا', 'سوید', 'هۆڵەندا', 'ڕووسیا',
  'چین', 'ژاپۆن', 'هیندستان', 'پاکستان',
  'برازیل', 'ئوستراڵیا',
];

// ڕەنگەکان - Colors
const colors: string[] = [
  'سوور', 'شین', 'زەرد', 'سەوز',
  'سپی', 'ڕەش', 'پەمەیی', 'مۆر', 'پرتەقاڵی',
  'قاوەیی', 'بۆر', 'خۆڵەمێشی', 'ئاسمانی', 'زەیتوونی',
  'ئاڵتوونی', 'زیوی', 'نیلی', 'تاریک',
];

// خواردنەوەکان - Drinks
const drinks: string[] = [
  'ئاو', 'چا', 'قاوە', 'شیر', 'ماستاو',
  'شەربەت', 'شەربەتی لیمۆ', 'شیر مۆز',
  'نیسکافە', 'کاپۆچینۆ', 'چای سەوز', 'کاکاو',
  'بیبسی',
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

// Get total category count
export const getTotalCategoryCount = (): number => {
  return categories.length;
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

export default categories