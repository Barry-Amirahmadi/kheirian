export type Product = {
  id: string;
  number: string;
  title: string;
  description: string;
  imageSrc: string;
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
  },
  {
    id: "falat-open",
    number: "۰۲",
    title: "درب بازشو",
    description: "طراحی درب و کف مجزا برای باز شدن بدون آسیب به محصول.",
    imageSrc: "/images/products/falat-box-lid-open.jpg",
  },
  {
    id: "falat-lid",
    number: "۰۳",
    title: "درب چاپی",
    description: "سطح چاپ‌پذیر یکدست برای هویت بصری برند.",
    imageSrc: "/images/products/falat-lid-alone.jpg",
  },
  {
    id: "falat-base",
    number: "۰۴",
    title: "کف مقاوم",
    description: "کف تقویت‌شده برای تحمل وزن و فشار انبارش.",
    imageSrc: "/images/products/falat-base-alone.jpg",
  },
  {
    id: "pistachio-tray",
    number: "۰۵",
    title: "سینی داخلی",
    description: "سینی محافظ که محصول را در جای خود ثابت نگه می‌دارد.",
    imageSrc: "/images/products/pistachio-tray.jpg",
  },
  {
    id: "lineup",
    number: "۰۶",
    title: "خانواده محصول",
    description: "مجموعه اندازه‌های مختلف با زبان طراحی مشترک.",
    imageSrc: "/images/products/product-lineup-sheet.jpg",
  },
  {
    id: "kraft-series",
    number: "۰۷",
    title: "سری کرافت",
    description: "کارتن کرافت بدون روکش برای محصولات ارگانیک.",
    imageSrc: "/images/products/placeholder-kraft.jpg",
  },
  {
    id: "onyx-series",
    number: "۰۸",
    title: "سری آنیکس",
    description: "جعبه مشکی مات با فویل طلا برای بسته‌های هدیه.",
    imageSrc: "/images/products/placeholder-onyx.jpg",
  },
];
