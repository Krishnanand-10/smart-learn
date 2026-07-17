import './globals.css';
import TopNavbar from '@/components/TopNavbar';
import NextAuthProvider from '@/components/NextAuthProvider';

export const metadata = {
  title: 'Smart Learn',
  description: 'AI-Powered Study and Learning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <div className="app-layout">
            <TopNavbar />
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
