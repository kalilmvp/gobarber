import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiLock, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, AnimationContainer, Content, Background } from './styles';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignupFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('Email é obrigatório')
            .email('Email está inválido'),
          password: Yup.string().min(
            6,
            'Password precisa ter no mínimo 6 dígitos'
          ),
        });
        await schema.validate(data, { abortEarly: false });

        await api.post('users', data);

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Já podes fazer seu logon no GoBarber Web',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.error(err);
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao fazer o cadastro',
          description:
            'Ocorreu algum erro ao fazer o cadastro, tente novamente',
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logo} alt="Gobarber Web" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Name" />
            <Input name="email" icon={FiMail} type="text" placeholder="Email" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft size={16} />
            Voltar
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Signup;
