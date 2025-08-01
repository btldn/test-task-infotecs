export const metadata = {
  title: 'User Table App',
  description: 'Тестовое задание с таблицей пользователей',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head />
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 20 }}>
        {children}
      </body>
    </html>
  );
}