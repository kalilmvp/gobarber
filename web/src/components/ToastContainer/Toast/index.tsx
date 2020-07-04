import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { Container } from './styles';
import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);

      // caso seja retornada uma funcao do useEffect, ela SEMPRE e disparada caso
      // esse componente deixe de existir
      return () => {
        clearTimeout(timer);
      };
    }, 3000);
  }, [removeToast, message.id]);

  return (
    <Container
      style={style}
      type={message.type}
      discriminated={message.description ? 1 : 0}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>

        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
