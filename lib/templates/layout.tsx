import { type PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
