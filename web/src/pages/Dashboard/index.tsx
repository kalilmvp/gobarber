import { format, isAfter, isToday, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiClock, FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Appointment,
  Calendar,
  Container,
  Content,
  Header,
  HeaderContent,
  NextAppointment,
  Profile,
  Schedule,
  Section,
} from './styles';

interface MonthAvailabilityData {
  day: number;
  available: boolean;
}

interface AppointmentData {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityData[]
  >([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const { user, signOut } = useAuth();

  useEffect(() => {
    async function getMonthAvailability() {
      const response = await api.post(
        `providers/${user.id}/month-availabitly`,
        {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        }
      );
      setMonthAvailability(response.data);
    }

    getMonthAvailability();
  }, [currentMonth, user.id]);

  useEffect(() => {
    async function getAppointments() {
      const response = await api.post<AppointmentData[]>('appointments/me', {
        day: selectedDate.getDate(),
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
      });

      const appointmentsResponse = response.data.map((app) => {
        return {
          ...app,
          hourFormatted: format(parseISO(app.date), 'HH:mm'),
        };
      });

      setAppointments(appointmentsResponse);
    }
    getAppointments();
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((ma) => ma.available === false)
      .map((monthDay) => {
        return new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          monthDay.day
        );
      });
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateFormatted = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBr,
    });
  }, [selectedDate]);

  const selectedWeekDayFormatted = useMemo(() => {
    const weekDayFormatted = format(selectedDate, 'cccc', {
      locale: ptBr,
    });
    return weekDayFormatted[0].toUpperCase() + weekDayFormatted.slice(1);
  }, [selectedDate]);

  const nextAppointment = useMemo(() => {
    return appointments.find((app) => {
      return isAfter(parseISO(app.date), new Date());
    });
  }, [appointments]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((app) => {
      return parseISO(app.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((app) => {
      return parseISO(app.date).getHours() >= 12;
    });
  }, [appointments]);

  const handleDateChanged = useCallback(
    (day: Date, modifiers: DayModifiers) => {
      if (modifiers.available && !modifiers.disabled) {
        setSelectedDate(day);
      }
    },
    []
  );

  const handleMonthChanged = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje </span>}
            <span>{selectedDateFormatted} </span>
            <span>{selectedWeekDayFormatted} </span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p> Nenhum agendamento neste período</p>
            )}
            {morningAppointments.map((app) => (
              <Appointment key={app.id}>
                <span>
                  <FiClock />
                  {app.hourFormatted}
                </span>

                <div>
                  <img src={app.user.avatar_url} alt={app.user.name} />
                  <strong>{app.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length === 0 && (
              <p> Nenhum agendamento neste período</p>
            )}
            {afternoonAppointments.map((app) => (
              <Appointment key={app.id}>
                <span>
                  <FiClock />
                  {app.hourFormatted}
                </span>

                <div>
                  <img src={app.user.avatar_url} alt={app.user.name} />
                  <strong>{app.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            selectedDays={selectedDate}
            onDayClick={handleDateChanged}
            onMonthChange={handleMonthChanged}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
