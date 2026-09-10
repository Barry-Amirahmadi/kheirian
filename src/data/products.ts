export type Product = {
  id: string;
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  /** Describes what the photograph shows, for screen readers. */
  alt: string;
};

/**
 * Gallery contents. Six entries point at real Kheirian photography; the last
 * two use carton-toned placeholders until those shots exist — swap `imageSrc`
 * and the rest of the row stays as is.
 */
export const PRODUCTS: Product[] = [
  {
    id: "falat-classic",
    number: "۰۱",
    title: "جعبه پسته فلات",
    description: "کارتن پنج لایه با چاپ افست و خط طلایی روی درب.",
    imageSrc: "/images/products/falat-box-closed.jpg",
      alt: "جعبه مشکی بسته پسته فلات با نقش‌های طلایی روی درب",
  },
  {
    id: "falat-open",
    number: "۰۲",
    title: "درب بازشو",
    description: "طراحی درب و کف مجزا برای باز شدن بدون آسیب به محصول.",
    imageSrc: "/images/products/falat-box-lid-open.jpg",
      alt: "جعبه پسته با درب برداشته‌شده که کف و لایه‌های مقوا پیداست",
  },
  {
    id: "falat-lid",
    number: "۰۳",
    title: "درب چاپی",
    description: "سطح چاپ‌پذیر یکدست برای هویت بصری برند.",
    imageSrc: "/images/products/falat-lid-alone.jpg",
      alt: "درب جعبه به‌تنهایی، با سطح چاپ‌شده مشکی و طلایی",
  },
  {
    id: "falat-base",
    number: "۰۴",
    title: "کف مقاوم",
    description: "کف تقویت‌شده برای تحمل وزن و فشار انبارش.",
    imageSrc: "/images/products/falat-base-alone.jpg",
      alt: "کف جعبه به‌تنهایی، با دیواره‌های تقویت‌شده مقوایی",
  },
  {
    id: "eilya-citrus",
    number: "۰۵",
    title: "جعبه مرکبات ایلیا",
    description:
      "چاپ رنگی تمام‌قد برای برند خشکبار و مرکبات، با طراحی اختصاصی هر مشتری.",
    imageSrc: "/images/products/eilya-citrus-box.jpg",
    alt: "جعبه سبز مرکبات ایلیا با تصویر لیموی تازه و نشان برند روی درب",
  },
  {
    id: "ssj-white",
    number: "۰۶",
    title: "پسته SSJ — طرح سفید",
    description: "چاپ ظریف روی زمینه روشن، برای برندی با ۹۹ سال سابقه.",
    imageSrc: "/images/products/ssj-white-box.jpg",
    alt: "جعبه سفید پسته SSJ با نقش هندسی طلایی، نشان ۹۹ سال اعتماد و کد QR",
  },
  {
    id: "ssj-pink",
    number: "۰۷",
    title: "پسته SSJ — طرح صورتی",
    description: "یک هویت بصری، چند رنگ‌بندی — بدون تغییر در استحکام کارتن.",
    imageSrc: "/images/products/ssj-pink-box.jpg",
    alt: "همان جعبه پسته SSJ در رنگ صورتی با نقش برگ و دانه پسته",
  },
  {
    id: "falat-front",
    number: "۰۸",
    title: "فلات پسته — نمای کامل",
    description: "طراحی مشکی و طلایی برای بازار پرمیوم و هدیه.",
    imageSrc: "/images/products/falat-front.jpg",
    alt: "جعبه مشکی فلات پسته با نقش‌های طلایی و تصویر بیضی پسته خندان",
  },
];
