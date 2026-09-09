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
    id: "pistachio-tray",
    number: "۰۵",
    title: "سینی داخلی",
    description: "سینی محافظ که محصول را در جای خود ثابت نگه می‌دارد.",
    imageSrc: "/images/products/pistachio-tray.jpg",
      alt: "سینی سفید پر از پسته خندان",
  },
  {
    id: "lineup",
    number: "۰۶",
    title: "خانواده محصول",
    description: "مجموعه اندازه‌های مختلف با زبان طراحی مشترک.",
    imageSrc: "/images/products/product-lineup-sheet.jpg",
      alt: "چند جعبه در اندازه‌های مختلف کنار هم روی سطح روشن",
  },
  {
    id: "kraft-series",
    number: "۰۷",
    title: "سری کرافت",
    description: "کارتن کرافت بدون روکش برای محصولات ارگانیک.",
    imageSrc: "/images/products/placeholder-kraft.jpg",
      alt: "نمونه رنگ کرافت قهوه‌ای — تصویر جایگزین تا عکس واقعی برسد",
  },
  {
    id: "onyx-series",
    number: "۰۸",
    title: "سری آنیکس",
    description: "جعبه مشکی مات با فویل طلا برای بسته‌های هدیه.",
    imageSrc: "/images/products/placeholder-onyx.jpg",
      alt: "نمونه رنگ مشکی مات با خطوط طلایی — تصویر جایگزین تا عکس واقعی برسد",
  },
];
