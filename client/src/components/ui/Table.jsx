import React from 'react';

const Table = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-lg shadow-sm border border-primary-100 ${className}`}>
      <table className="w-full" {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead className={`bg-primary-50 text-secondary-800 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody className={`bg-white divide-y divide-primary-100 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({
  children,
  className = "",
  isHoverable = true,
  ...props
}) => {
  return (
    <tr 
      className={`${isHoverable ? 'hover:bg-primary-50 transition-colors duration-150' : ''} ${className}`} 
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <td className={`px-4 py-3 text-sm text-secondary-700 ${className}`} {...props}>
      {children}
    </td>
  );
};

export const TableHeaderCell = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-secondary-800 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  );
};

export default Table;
