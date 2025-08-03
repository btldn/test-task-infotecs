'use client';

import { useEffect, useState } from 'react';

export default function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  let sortedUsers = [...users];

  if (sortField && sortOrder) {
    sortedUsers.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName} ${a.maidenName}`;
          bValue = `${b.firstName} ${b.lastName} ${b.maidenName}`;
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'gender':
          aValue = a.gender;
          bValue = b.gender;
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue, 'ru', { sensitivity: 'base' })
          : bValue.localeCompare(aValue, 'ru', { sensitivity: 'base' });
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  return (
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
            ФИО {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
          </th>
          <th onClick={() => toggleSort('age')} style={{ cursor: 'pointer' }}>
            Возраст {sortField === 'age' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
          </th>
          <th onClick={() => toggleSort('gender')} style={{ cursor: 'pointer' }}>
            Пол {sortField === 'gender' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
          </th>
          <th onClick={() => toggleSort('phone')} style={{ cursor: 'pointer' }}>
            Телефон {sortField === 'phone' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
          </th>
          <th>Email</th>
          <th>Город</th>
        </tr>
      </thead>

      <tbody>
        {sortedUsers.map((user) => (
          <tr key={user.id}>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.age}</td>
            <td>{user.gender === 'male' ? 'муж.' : 'жен.'}</td>
            <td>{user.phone}</td>
            <td>{user.email}</td>
            <td>{user.address.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
