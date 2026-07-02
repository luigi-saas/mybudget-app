import { ReactNode } from "react";
import LocaleIntlProviderClient from "@/components/LocaleIntlProviderClient";
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";
import arMessages from "../../messages/ar.json";

const messages = {
  en: enMessages,
  fr: frMessages,
  ar: arMessages,
} as const;

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
  const localeMessages = messages[params.locale];

  return (
    <LocaleIntlProviderClient
      locale={params.locale}
      messages={localeMessages}
    >
      {children}
    </LocaleIntlProviderClient>
  );
}
