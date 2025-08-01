'use client';

import Table from '../components/Table';

export default function HomePage() {
  return (
    <main>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Список пользователей</h1>
      <Table />
    </main>
  );
}