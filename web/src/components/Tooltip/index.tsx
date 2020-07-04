import React from 'react';
import { Container } from './styles';

interface TooltipProps {
  title: string;
  // with this property a parent component can pass styles to the child
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
