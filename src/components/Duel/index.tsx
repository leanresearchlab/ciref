import { backendApi } from '@/services/api';
import { useDuelStore } from '@/stores/duel';
import { useSelectRepo } from '@/stores/repo';
import { useTimeWindow } from '@/stores/timeWindow';
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Icon,
  Select,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { RiUser2Line, RiUserLine } from 'react-icons/ri';
import DuelPersonItem from './DuelPersonItem';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const categories = [
  'add',
  'remove',
  'move',
  'rename',
  'change',
  'extract',
  'split',
  'merge',
  'replace',
  'modify',
  'inline',
  'others',
];
const Duel: React.FC = () => {
  const [duelData, setDuelData] = useState([]);
  const { challenged, challenger } = useDuelStore(
    ({ challenger, challenged }) => ({ challenged, challenger })
  );
  const [startDate, endDate] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
  ]);
  const { selectedRepo, repos } = useSelectRepo(({ selectedRepo, repos }) => ({
    selectedRepo,
    repos,
  }));

  const { data, refetch } = useQuery(
    ['repo-people'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);

      if(!findRepoInfo) {
        return { initialData: [] };
      }

      try {
        const response = await backendApi.get(`/repo/people/${findRepoInfo.repoId}`);

        return response.data;
      } catch(error) {
        console.error('Error fetching data from API');
        return { initialData: [] };
      }
    },
    { initialData: [] }
  );

  useEffect(() => {
    if (challenger && challenged) {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);

      backendApi
        .post('/duel', {
          repoUrl: findRepoInfo.repoUrl,
          user1: challenger,
          user2: challenged,
          startDate,
          endDate,
        })
        .then((response) =>
          setDuelData(
            response.data.map((user) => {
              const total = categories.map((i) => {
                return user.refacts[i]?.total ?? 0;
              });
              return { ...user, total };
            })
          )
        );
    }
  }, [challenged, challenger]);
  
  useEffect(() => {
    refetch();
  }, [selectedRepo]);

  return (
    <Flex bg="white" p="4" borderRadius="md">
      <VStack>
        <Box>
          <Text fontWeight="semibold">Duel of developers</Text>
          <Text fontSize="smaller">
            Compare the refactorings made by the developers
          </Text>
        </Box>
        <Divider />
        <VStack w="100%" spacing="4">
          {data.length && data.map((i) => <DuelPersonItem key={i.login} login={i.login} />)}
        </VStack>
      </VStack>
      <Spacer />
      <Box>
        {!!duelData.length && (
          <Flex width="100%">
            <Divider orientation="vertical" />
            <Chart
              options={{
                chart: {
                  height: 350,
                  type: 'radar',
                  dropShadow: {
                    enabled: true,
                    blur: 1,
                    left: 1,
                    top: 1,
                  },
                },
                plotOptions: {
                  radar: {
                    polygons: {
                      strokeColors: ['#e8e8e8'],
                      fill: {
                        colors: ['#f8f8f8', '#fff'],
                      },
                    },
                  },
                },
                stroke: {
                  width: 2,
                },
                fill: {
                  opacity: 0.1,
                },
                yaxis: { show: false },
                xaxis: {
                  categories: categories,
                },
              }}
              series={[
                { name: duelData[0]?.user, data: duelData[0]?.total ?? [] },
                { name: duelData[1]?.user, data: duelData[1]?.total ?? [] },
              ]}
              type="radar"
              height={350}
            />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Duel;
