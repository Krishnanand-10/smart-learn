import './globals.css';
import TopNavbar from '@/components/TopNavbar';

export const metadata = {
  title: 'Smart Learn',
  description: 'AI-Powered Exam Preparation Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <TopNavbar />
          {children}
        </div>
      </body>
    </html>
  );
}
