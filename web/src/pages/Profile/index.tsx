import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser, FiCamera } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleAvatarChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e && e.target.files) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);

        api.patch('users/avatar', formData).then((response) => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
            description: 'Parabéns, seu avatar foi atualizado',
          });
        });
      }
    },
    [addToast, updateUser]
  );

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      // console.log(data);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('Email é obrigatório')
            .email('Email está inválido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });
        await schema.validate(data, { abortEarly: false });

        const formData = {
          name: data.name,
          email: data.email,
          ...(data.old_password
            ? {
                old_password: data.old_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Atualização efetuada com sucesso',
        });

        history.push('/Dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          console.error(err);
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao realizar o update do perfil',
          description:
            'Ocorreu algum erro ao fazer a atualização, tente novamente',
        });
      }
    },
    [addToast, history, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/Dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form ref={formRef} initialData={user} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChanged}
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Name" />
          <Input name="email" icon={FiMail} type="text" placeholder="Email" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />
          <Button type="submit">Confirmar alterações</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
