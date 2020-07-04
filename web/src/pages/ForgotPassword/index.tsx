import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import logo from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { AnimationContainer, Background, Container, Content } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().required('Email é obrigatório'),
        });
        await schema.validate(data, { abortEarly: false });

        await api.post('password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um email para confirmar a recuperação de senha',
        });

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.error(err);
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }
        // disparar um toast

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: 'Ocorreu algum erro ao recuperar a sua senha',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="Gobarber Web" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar a senha</h1>

            <Input name="email" icon={FiMail} type="text" placeholder="Email" />
            <Button loading={loading} type="submit">
              Recuperar sua senha
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn size={16} />
            Voltar ao Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
