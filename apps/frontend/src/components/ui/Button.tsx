import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  onClick?: () => void;
  children: React.ReactNode;
  href?: string;
}

const Button: React.FC<Props> = ({ onClick, children, href, ...props }) => {
  const className =
    'p-2 text-muted hover:text-brand hover:bg-surface rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center';

  if (href) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
