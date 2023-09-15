import {
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import {
  RiLogoutCircleRLine,
} from 'react-icons/ri';

const Profile: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <Flex alignItems="center" justifyContent="space-around" w="100%">
        <Box as="img" src={session?.user.avatar} width="16" borderRadius="16" />
        <Box>
          <Text fontSize="lg" fontWeight="medium">
            {session?.user.name}
          </Text>
          <Text color="gray.400" fontWeight="regular">
            @{session?.user.username}
          </Text>
        </Box>
        <Tooltip label="Exit the application">
          <IconButton
            aria-label="exit"
            colorScheme="red"
            variant="ghost"
            onClick={() => signOut()}
            icon={<RiLogoutCircleRLine />}
          />
        </Tooltip>
      </Flex>
    </>
  );
};

export default Profile;
