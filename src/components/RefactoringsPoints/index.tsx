import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useTimeWindow } from '@/stores/timeWindow';

const RefactoringsPoints: React.FC = () => {
  const { repos, selectedRepo } = useSelectRepo(({ repos, selectedRepo }) => ({
    repos,
    selectedRepo,
  }));
  const [startDate, endDate,option] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
    state.option
  ]);
  const { data } = useQuery(
    ['refacts-by-authors-points'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);
      
      if(!findRepoInfo) {
        return { initialData: [] };
      }

      try {
        const response = await backendApi.get('/refacts/points/users', {
          params: {
            repoUrl: findRepoInfo.repoUrl,
            startDate, endDate
          }
        });

        return response.data;
      } catch(error) {
        console.error('Error fetching data from API');
        return { initialData: [] };
      }
    },
    { initialData:[], refetchInterval: 30000 }
  );

  return (
    <Flex w="20%" h="auto">
      <Box w="100%" bg="white" borderRadius="md" p="4">
        <Text fontWeight="semibold">Refactorings</Text>
        <Text fontSize="smaller">Refactorings by points</Text>
        {data?.length && (
          <Flex p="4" flexDir="column" align={'center'}>
            <Avatar src={data[0]?.user.avatar} size="xl" />
            <Text fontWeight="medium">{data[0]?.user.login}</Text>
            <Badge variant="subtle" colorScheme="green">
              {`${data[0]?.total} points`}
            </Badge>
          </Flex>
        )}
        {data?.length > 2 && (
          <>
            <Divider />
            <VStack p="2" spacing="4">
              {data &&
                data.slice(1, data.length).map((i) => (
                  <HStack w="100%" key={i.user.login}>
                    <Avatar size="xs" src={i.user.avatar} />
                    <Text fontSize={'sm'}>{i?.user.login}</Text>
                    <Badge variant="subtle" colorScheme="green">
                      {`${i.total}`}
                    </Badge>
                  </HStack>
                ))}
            </VStack>
            <Button size="sm" mt="4" w="100%" variant="outline">
              View all
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default RefactoringsPoints;
