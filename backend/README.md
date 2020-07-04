# Recuperação de Senha ( FEITO )

**RF**

- O usuário deve poder recuperar sua senha informando o email
- O usuário deve receber email com instruções de recuperação de senha
- O usuário deve poder resetar sua senha

**RNF**

- Utilizar Mailtrap para testar envios em dev
- Utilizar Amazon SES para envios em Produção
- O envio de emails deve acontecer em segundo plano ( job )

**RN**

- O link enviado para resetar senha deve expirar em 2h
- O usuário precisa confirmar a senha ao resetar a senha

# Atualização do Perfil ( FEITO )

**RF**

- O usuário deve poder atualizar o seu perfil

**RN**

- O usuário não pode atualizar o seu email para um já existente
- Para atualizar a senha, deve-se informar a antiga
- Para atualizar a senha, deve-se confirmar a nova

# Painél do Prestador

**RF**

- O usuário não pode atualizar o seu email para um já existente
- O prestador deve receber uma notificação sempre que houver um novo agendamento
- O prestador deve poder visualizar as notificações não-lidas

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no MongoDB
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io

**RN**

- A notificação deve ter um status de LIDA ou NÃO-LIDA para que o prestador possa controlar

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrado
- O usuário deve poder listar os dias de um mês com pelo menos um horádio disponível de um prestador
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador
- O usuário deve poder realizar um novo agendamento com um prestador

**RNF**

- A listagem de prestadores será armazenada em cache

**RN**

- Cada agendamento irá durar 1h
- Os agendamentos devem estar disponíveis entre 8 às 18h ( primeiro às 08h, último às 17h)
- O usuário não pode agendar um horário já ocupado
- O usuário não pode agendar em um horário que já passou
- O usuário não pode agendar serviços consigo mesmo
