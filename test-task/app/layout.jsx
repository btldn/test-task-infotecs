export const metadata = {
  title: 'User Table App',
  description: 'Тестовое задание с таблицей пользователей',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head />
      <body >
        <div className="page__layout">
          {children}
        </div>
      </body>
    </html>
  );
}