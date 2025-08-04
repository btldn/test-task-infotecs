'use client';

import { useEffect, useState } from 'react';
import styles from './Table.module.css';

export default function Table() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

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

  let filteredUsers = [...users];

  if (filterText.trim() !== '') {
    filteredUsers = filteredUsers.filter((user) => {
      const fullName = `${user.lastName} ${user.firstName} ${user.maidenName}`.toLowerCase();
      return fullName.includes(filterText.toLowerCase());
    });
  }

  if (genderFilter) {
    filteredUsers = filteredUsers.filter((user) => user.gender === genderFilter);
  }

  if (cityFilter.trim() !== '') {
    filteredUsers = filteredUsers.filter((user) =>
      user.address.city.toLowerCase().includes(cityFilter.toLowerCase())
    );
  }

  let sortedUsers = [...filteredUsers]

  if (sortField && sortOrder) {
    sortedUsers.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = `${a.lastName} ${a.firstName} ${a.maidenName}`;
          bValue = `${b.lastName} ${b.firstName} ${b.maidenName}`;
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
    <div className={styles['table-wrapper']}>
      <h1 className={styles['table-title']}>Список пользователей</h1>
      <div className={styles['table-filters']}>
        <input
          className={styles['table-filters__input']}
          type="text"
          placeholder="Поиск по ФИО"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <select className={styles['table-filters__select']} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">Пол (все)</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>

        <input
          className={styles['table-filters__input']}
          type="text"
          placeholder="Поиск по городу"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
      </div>

      <table className={styles['table']} border="1" cellPadding="8" cellSpacing="0" >
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
              <td>{`${user.firstName} ${user.lastName} ${user.maidenName}`}</td>
              <td>{user.age}</td>
              <td>{user.gender === 'male' ? 'муж.' : 'жен.'}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
