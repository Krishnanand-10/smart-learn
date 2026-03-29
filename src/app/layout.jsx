import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Exam Brain',
  description: 'AI-Powered Exam Preparation Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
