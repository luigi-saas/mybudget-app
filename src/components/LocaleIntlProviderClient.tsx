"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export default function LocaleIntlProviderClient({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: Record<string, any> | undefined;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>{children}</div>
    </NextIntlClientProvider>
  );
}
