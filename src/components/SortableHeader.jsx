import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const SortableHeader = ({ 
  field, 
  currentSort, 
  onSortChange,
  children 
}) => {
  const getSortOrder = () => {
    const sortField = currentSort.split(',')
      .find(s => s.startsWith(`${field}:`));
    return sortField ? sortField.split(':')[1] : null;
  };

  const handleClick = () => {
    const currentOrder = getSortOrder();
    let newSort;
    
    if (currentOrder === 'ASC') {
      newSort = `${field}:DESC`;
    } else if (currentOrder === 'DESC') {
      // Remove from sort if clicking again on DESC
      newSort = currentSort.split(',')
        .filter(s => !s.startsWith(`${field}:`))
        .join(',');
    } else {
      // Add to beginning of sort
      newSort = `${field}:ASC,${currentSort}`;
    }
    
    onSortChange(newSort);
  };

  const getPriority = () => {
    const sortFields = currentSort.split(',');
    const index = sortFields.findIndex(s => s.startsWith(`${field}:`));
    return index >= 0 ? index + 1 : null;
  };

  const order = getSortOrder();
  const priority = getPriority();

  return (
    <th 
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {children}
        <span style={{ marginLeft: '8px' }}>
          {!order && <FaSort color="#ccc" />}
          {order === 'ASC' && <FaSortUp />}
          {order === 'DESC' && <FaSortDown />}
        </span>
        {priority && (
          <span 
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              fontSize: '0.7rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {priority}
          </span>
        )}
      </div>
    </th>
  );
};

export default SortableHeader; 