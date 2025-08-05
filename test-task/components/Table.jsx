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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [selectedUser, setSelectedUser] = useState(null);

  const [columnWidths, setColumnWidths] = useState({
    name: 200,
    age: 100,
    gender: 100,
    phone: 160,
    email: 220,
    country: 140,
    city: 140,
  });


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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  console.log(paginatedUsers);

  const handleMouseDown = (e, columnKey) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey];

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(Math.max(80, startWidth + deltaX), 300);
      setColumnWidths((prev) => ({
        ...prev,
        [columnKey]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  return (
    <div className={styles['table__wrapper']}>
      <h1 className={styles['table__title']}>Список пользователей</h1>
      <div className={styles['table__filters']}>
        <input
          className={styles['table__filters-input']}
          type="text"
          placeholder="Поиск по ФИО"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <select className={styles['table__filters-select']} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">Пол (все)</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>

        <input
          className={styles['table__filters-input']}
          type="text"
          placeholder="Поиск по городу"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
      </div>

      <table className={styles['table']} border="1" cellPadding="8" cellSpacing="0" >
        <thead>
          <tr>
            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.name}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('name')}
                style={{ cursor: 'pointer' }}
              >
                ФИО {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'name')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.age}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('age')}
                style={{ cursor: 'pointer' }}
              >
                Возраст {sortField === 'age' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'age')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.gender}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('gender')}
                style={{ cursor: 'pointer' }}
              >
                Пол {sortField === 'gender' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'gender')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.phone}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('phone')}
                style={{ cursor: 'pointer' }}
              >
                Телефон {sortField === 'phone' ? (sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '') : ''}
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'phone')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.email}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('email')}
                style={{ cursor: 'pointer' }}
              >
                Email
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'email')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.country}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('country')}
                style={{ cursor: 'pointer' }}
              >
                Страна
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'country')}
              />
            </th>

            <th
              className={styles['table__th']}
              style={{ width: `${columnWidths.city}px` }}
            >
              <div
                className={styles['table__th-content']}
                onClick={() => toggleSort('city')}
                style={{ cursor: 'pointer' }}
              >
                Город
              </div>
              <div
                className={styles['table__th-resizer']}
                onMouseDown={(e) => handleMouseDown(e, 'city')}
              />
            </th>
          </tr>

        </thead>

        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
              <td className={styles['table__td']} style={{ width: columnWidths.name }}>{`${user.firstName} ${user.lastName} ${user.maidenName}`}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.age }}>{user.age}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.gender }}>{user.gender === 'male' ? 'муж.' : 'жен.'}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.phone }}>{user.phone}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.email }}>{user.email}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.country }}>{user.address.country}</td>
              <td className={styles['table__td']} style={{ width: columnWidths.city }}>{user.address.city}</td>
            </tr>
          ))}
        </tbody>

      </table>

      {selectedUser && (
        <div className={styles['table__modal-backdrop']} onClick={() => setSelectedUser(null)}>
          <div className={styles['table__modal']} onClick={(e) => e.stopPropagation()}>
            <button className={styles['table__modal-close']} onClick={() => setSelectedUser(null)}>×</button>
            <img className={styles['table__modal-avatar']} src={selectedUser.image} alt="avatar" />
            <h2 className={styles['table__modal-name']}>{`${selectedUser.firstName} ${selectedUser.lastName} ${selectedUser.maidenName}`}</h2>
            <p className={styles['table__modal-info']}><b>Возраст: </b>{selectedUser.age}</p>
            <p className={styles['table__modal-info']}><b>Рост: </b>{selectedUser.height} см</p>
            <p className={styles['table__modal-info']}><b>Вес: </b>{selectedUser.weight} кг</p>
            <p className={styles['table__modal-info']}><b>Телефон: </b>{selectedUser.phone}</p>
            <p className={styles['table__modal-info']}><b>Email: </b>{selectedUser.email}</p>
            <p className={styles['table__modal-info']}>
              <b>Адрес: </b>{`${selectedUser.address.country}, ${selectedUser.address.city}, ${selectedUser.address.address}`}
            </p>
          </div>
        </div>
      )}


      <div className={styles['table__pagination']} >
        <button className={styles['table__pagination-button']}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>
        <span className={styles['table__pagination-label']} >Страница {currentPage}</span>
        <button className={styles['table__pagination-button']}
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(sortedUsers.length / itemsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(sortedUsers.length / itemsPerPage)}

        >
          →
        </button>
      </div>

    </div>
  );
}
