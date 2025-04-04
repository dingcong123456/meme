import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import AntdProvider from '@/context/antdProvider';

export const metadata = {
  title: "meme",
  description: "meme",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" className='dark'>
      <body
        className={`antialiased`}
      >
        <AntdRegistry>
          <AntdProvider>
            {children}
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
