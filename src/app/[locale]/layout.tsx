import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: "en" | "fr" | "ar" };
}) {
  const messages = (await import(`../../messages/${params.locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div dir={params.locale === "ar" ? "rtl" : "ltr"}>{children}</div>
    </NextIntlClientProvider>
  );
}
