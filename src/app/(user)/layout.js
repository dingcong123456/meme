import { GlobalProvider } from '@/context/global';
import NavHeader from '@/components/NavHeader';

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
        <GlobalProvider serverValue={{ urlInfo }}>
          <div className='h-full w-full flex flex-col overflow-auto' style={{ background: '#1B1D27' }}>
            <NavHeader />
            {children}
          </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
