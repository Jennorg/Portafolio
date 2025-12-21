import React from 'react';

interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-muted hover:text-brand hover:bg-surface rounded-lg transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
};

export default Button;
