import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import Chart from 'react-apexcharts';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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

// import { Container } from './styles';

const RefactByAuthorsPoints: React.FC = () => {
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
    ['refacts-by-authors-points'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);
      
      return backendApi
        .get('/refacts/points/users', {
          params: {
            repoUrl: findRepoInfo.repoUrl,
            startDate,endDate
          },
        })
        .then((res) => res.data);
    },
    { initialData:[] }
  );

  useEffect(()=>{refetch()},[option,selectedRepo])
  
  return (
    <Flex w="20%" h="auto">
      <Box w="100%" bg="white" borderRadius="md" p="4">
        <Text fontWeight="semibold">Refatorações</Text>
        <Text fontSize="smaller">Refatorações por pontos</Text>
        {data?.length && (
          <Flex p="4" flexDir="column" align={'center'}>
            <Avatar src={data[0]?.user.avatar} size="xl" />
            <Text fontWeight="medium">{data[0]?.user.login}</Text>
            <Badge variant="subtle" colorScheme="green">
              {`${data[0]?.total} pontos`}
            </Badge>
          </Flex>
        )}
        {data?.length > 2 && (
          <>
            <Divider />
            <VStack p="2" spacing="4">
              {data &&
                data.slice(1, data.length).map((i) => (
                  <HStack w="100%">
                    <Avatar size="xs" src={i.user.avatar} />
                    <Text fontSize={'sm'}>{i?.user.login}</Text>
                    <Badge variant="subtle" colorScheme="green">
                      {`${i.total}`}
                    </Badge>
                  </HStack>
                ))}
            </VStack>
            <Button size="sm" mt="4" w="100%" variant="outline">
              Ver todos
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default RefactByAuthorsPoints;
