import { useDuelStore } from '@/stores/duel';
import {
  Button,
  Flex,
  Icon,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { RiSwordFill, RiSwordLine, RiUserLine } from 'react-icons/ri';

interface DuelPersonItemProps {
  login: string;
}

const DuelPersonItem: React.FC<DuelPersonItemProps> = ({ login }) => {
  const { challenged, challenger, defineChallenged, defineChallenger } =
    useDuelStore(
      ({ challenged, challenger, defineChallenged, defineChallenger }) => ({
        challenged,
        challenger,
        defineChallenged,
        defineChallenger,
      })
    );

  function handleSelectDev() {
    if (active) {
      isChallenged
        ? defineChallenged('')
        : isChallenger && defineChallenger('');
      return;
    }
    if (challenger) {
      defineChallenged(login);
      return;
    }
    defineChallenger(login);
  }
  const active = challenged === login || challenger === login;
  const isChallenger = challenger === login;
  const isChallenged = challenged === login;
  const disable = !!challenger && !!challenged;

  return (
    <Button
      w="100%"
      p="2"
      cursor="pointer"
      borderRadius="sm"
      justifyContent="flex-start"
      variant={active ? 'solid' : 'ghost'}
      onClick={handleSelectDev}
      isDisabled={!isChallenged ? (!isChallenger ? disable : false) : false}
    >
      <Icon as={RiUserLine} color="primary.500" />
      <Text ml="2" color={active ? 'gray.900' : 'gray.400'}>
        {login}
      </Text>
      <Spacer />
      {active && (
        <Tag>
          <Tag size="sm" variant="solid" colorScheme="purple">
            <TagLeftIcon boxSize="16px" as={RiSwordLine} />
            <TagLabel>{isChallenged ? 'Desafiado' : 'Desafiante'}</TagLabel>
          </Tag>
        </Tag>
      )}
    </Button>
  );
};

export default DuelPersonItem;
