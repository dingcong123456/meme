import { GlobalProvider } from '@/context/global';
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import NavHeader from '@/components/NavHeader';
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
  const superbase = process.env.SUPABASE_URL;
  const imageBucket = process.env.IMAGE_BUCKET;
  const tokenLogo = process.env.TOKEN_LOGO;
  const filePrefix = process.env.FILE_PREFIX;
  const socketHost = process.env.SOCKET_HOST;
  const urlInfo = { superbase, imageBucket, tokenLogo, filePrefix, socketHost };
  
  return (
    <html lang="en" className='dark'>
      <body
        className={`antialiased`}
      >
        <AntdRegistry>
          <AntdProvider>
            <GlobalProvider serverValue={{urlInfo}}>
              <div className='h-full w-full flex flex-col max-w-7xl mx-auto'>
                <NavHeader />
                {children}
              </div>
            </GlobalProvider>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
