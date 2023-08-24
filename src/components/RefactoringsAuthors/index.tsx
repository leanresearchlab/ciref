import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useTimeWindow } from '@/stores/timeWindow';

const RefactoringsAuthors: React.FC = () => {
  const { repos, selectedRepo } = useSelectRepo(({ repos, selectedRepo }) => ({
    repos,
    selectedRepo,
  }));
  const [startDate, endDate,option] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
    state.option
  ]);
  const { data, isFetching,refetch } = useQuery(
    ['refacts-by-authors'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);
      
      if (!findRepoInfo) {
        return { initialData: [] };
      }
      try {
        const response = await backendApi.get('/refacts/users', {
          params: {
            repoUrl: findRepoInfo.repoUrl,
            startDate,endDate
          },
        });

        return response.data;
      } catch (error) {
        console.error('Error fetching data from API');
        return { initialData: [] };
      }
    },
    { initialData: [] }
  );

  useEffect(()=>{refetch()},[option,selectedRepo])

  return (
    <Flex w="20%">
      <Box w="100%"bg="white" borderRadius="md" p="4">
        {isFetching && <Spinner/>}
        {!isFetching && (
          <>
            <Text fontWeight="semibold">Refactorings</Text>
            <Text fontSize="smaller">Refactorings in abosolute numbers</Text>
            {!data.length && (
              <Center flexDirection="column" p="4">
                <Image
                  src="/assets/empty-box.png"
                  width={100}
                  height={100}
                ></Image>
                <Text color="gray.400">No refactorings identified</Text>
              </Center>
            )}
            {!!data.length && (
              <Flex p="4" flexDir="column" align={'center'}>
                <Avatar src={data[0]?.user.avatar} size="xl" />
                <Text fontWeight="medium">{data[0]?.user.login}</Text>
                <Badge variant="subtle" colorScheme="green">
                  {`${data[0]?.total} Refactorings`}
                </Badge>
              </Flex>
            )}
            {data.length > 2 && (
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
                <Spacer/>
                <Button size="sm" mt="4" w="100%" variant="outline">
                  View all
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default RefactoringsAuthors;
