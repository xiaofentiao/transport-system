
import React from 'react';

const OperationIcon = ({ icon, onClick, title }: any) => {
  return React.cloneElement(icon, {
    title: title,
    className: 'blue cur-ptr',
    style: { fontSize: 18, padding: '0 4px' },
    onClick: () => onClick && onClick(),
  });
};

export default OperationIcon;
