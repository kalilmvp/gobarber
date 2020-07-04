import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  ProfileButton,
  UserAvatar,
  UserName,
  ProvidersListTitle,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';

export interface ProviderData {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('providers');
      setProviders(response.data);
    }
    loadProviders();
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
    // signOut();
  }, [navigate]);

  const navigateToAppointment = useCallback(
    (provider_id: string) => {
      navigate('CreateAppointment', { provider_id });
    },
    [navigate]
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem-vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
      <ProvidersList
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        data={providers}
        keyExtractor={(provider) => provider.id}
        renderItem={({ item: provider }) => (
          <ProviderContainer onPress={() => navigateToAppointment(provider.id)}>
            <ProviderAvatar
              source={{
                uri: provider.avatar_url
                  ? provider.avatar_url
                  : 'https://avatars2.githubusercontent.com/u/1149085?s=460&u=bdd75b5bbdc32bfadc4df8d3303b786447a04c0f&v=4',
              }}
            />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9900" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9900" />
                <ProviderMetaText>08:00 às 18:00</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
