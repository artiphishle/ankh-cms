import { type PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnkhCmsConfigProvider } from "ankh-config";

import './globals.css';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <AnkhCmsConfigProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AnkhCmsConfigProvider>
      </body>
    </html>
  );
}
