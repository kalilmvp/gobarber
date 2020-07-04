import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import ImagePicker from 'react-native-image-picker';
import React, { useCallback, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmationRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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

        Alert.alert('Perfil atualizado com sucesso');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu algum erro ao atualizar o perfil, tente novamente'
        );
      }
    },
    [navigation, updateUser]
  );

  const handleUpdateAvatar = useCallback(() => {
    const options = {
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.error) {
        Alert.alert('Erro ao atualizar o seu avatar');
        return;
      }
      const data = new FormData();
      data.append('avatar', {
        uri: response.uri,
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
      });

      api.patch('users/avatar', data).then((responseData) => {
        updateUser(responseData.data);
      });
    });
  }, [updateUser, user.id]);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleNavigateBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="name"
                autoCapitalize="words"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <Input
                ref={emailRef}
                name="email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordRef}
                name="old_password"
                secureTextEntry
                icon="lock"
                placeholder="Senha atual"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
              <Input
                ref={passwordRef}
                name="password"
                secureTextEntry
                icon="lock"
                placeholder="Senha"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordConfirmationRef.current?.focus();
                }}
              />
              <Input
                ref={passwordConfirmationRef}
                name="password_confirmation"
                secureTextEntry
                icon="lock"
                placeholder="Confirmar Senha"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
