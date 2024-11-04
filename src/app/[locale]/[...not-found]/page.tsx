import { notFound } from "next/navigation";

// The sole purpose of this page is to not require a global app/not-found.tsx file, which can't
// use any internationalization feature, thus not use the global layout in app/[locale]/layout.tsx
// More info: https://next-intl-docs.vercel.app/docs/environments/error-files#not-foundjs
export default function RedirectToNotFoundPage() {
  notFound();
}
