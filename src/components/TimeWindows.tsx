import { useTimeWindow } from '@/stores/timeWindow';
import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import React from 'react';
import {
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

const TimeWindows: React.FC = () => {
  const [
    option,
    setOption,
    defineEndDate,
    defineStartDate,
    endDate,
    startDate,
  ] = useTimeWindow((state) => [
    state.option,
    state.setOption,
    state.defineEndDate,
    state.defineStartDate,
    state.endDate,
    state.startDate,
  ]);
  function handleSelectTimeWindow(option: string) {
    switch (option) {
      case 'allProject':
        setOption('allProject');
        defineStartDate(undefined);
        defineEndDate(undefined);
        break;
      case 'last3months':
        setOption('last3months');
        defineStartDate(subMonths(new Date().setHours(0, 0, 0, 0), 3));
        defineEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
        break;
      case 'thisMonth':
        setOption('thisMonth');
        defineStartDate(startOfMonth(new Date().setHours(0, 0, 0, 0)));
        defineEndDate(endOfMonth(new Date().setHours(0, 0, 0, 0)));
        break;
      case 'thisWeek':
        setOption('thisWeek');
        defineStartDate(startOfWeek(new Date().setHours(0, 0, 0, 0)));
        defineEndDate(endOfWeek(new Date().setHours(0, 0, 0, 0)));
        break;
      default:
        break;
    }
  }
  return (
    <Flex>
      <ButtonGroup colorScheme="gray" size="md" isAttached variant="outline">
        <Button
          isActive={option === 'allProject'}
          onClick={() => handleSelectTimeWindow('allProject')}
        >
          Todo o projeto
        </Button>
        <Button
          isActive={option === 'last3months'}
          onClick={() => handleSelectTimeWindow('last3months')}
        >
          Últimos 3 meses
        </Button>
        <Button
          isActive={option === 'thisMonth'}
          onClick={() => handleSelectTimeWindow('thisMonth')}
        >
          Esse mês
        </Button>
        <Button
          isActive={option === 'thisWeek'}
          onClick={() => handleSelectTimeWindow('thisWeek')}
        >
          Essa semana
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default TimeWindows;
