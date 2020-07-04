import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';
import logo from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { Background, Container, AnimationContainer, Content } from './styles';

interface SigninFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SigninFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().required('Email é obrigatório'),
          password: Yup.string().required('Password é obrigatório'),
        });
        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.error(err);
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }
        // disparar um toast

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu algum erro ao fazer login',
        });
      }
    },
    [signIn, addToast, history]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="Gobarber Web" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Login</h1>

            <Input name="email" icon={FiMail} type="text" placeholder="Email" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />
            <Button type="submit">Entrar</Button>

            <Link to="/forgot">Esqueci a minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn size={16} />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default Signin;
