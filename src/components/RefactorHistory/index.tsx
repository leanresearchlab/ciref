import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import { useTimeWindow } from '@/stores/timeWindow';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RefactorHistory: React.FC = () => {
  const { repos, selectedRepo } = useSelectRepo(({ repos, selectedRepo }) => ({
    repos,
    selectedRepo,
  }));
  const [startDate, endDate, option] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
    state.option,
  ]);
  const { data } = useQuery(
    ['refacts-by-time'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);

      if (!findRepoInfo) {
        return { dates: [], values: [] };
      }
      try {
        const response = await backendApi.get('/refacts/time', {
          params: {
            repoId: findRepoInfo.repoId,
            startDate,
            endDate,
          },
        });

        const dates = [];
        const values = [];

        response.data.forEach((i) => {
          dates.push(
            format(new Date(i.commit_date), "dd 'de' MMM, yyyy", {
              locale: ptBr,
            })
          );
          values.push(i._count.id);
        });

        return { dates, values };
      } catch (error) {
        console.error('Error fetching data from API');
        return { dates: [], values: [] };
      }
    },
    { initialData: { dates: [], values: [] }, refetchInterval: 10000 }
  );

  return (
    <Flex w="100%" bg="white" p="4" borderRadius="md" flexDirection="column">
      <Box>
        <Text fontWeight="semibold">Refactorings</Text>
        <Text fontSize="smaller">
          Refactorings according to the progress of the project
        </Text>
      </Box>
      <Chart
        options={{
          chart: {
            width: '100%',
            height: 300,
            type: 'area',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
            style: {
              fontSize: "8px"
            }
          },
          theme: { monochrome: { enabled: true, color: '#6E51F2' } },

          stroke: {
            curve: 'stepline',
          },
          grid: {
            xaxis: {
              lines: {
                show: true
              }
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          noData: { text: 'No data available' },
          xaxis: {
            categories: data.dates,
          },
        }}
        series={[{ name: 'Executed refactorings', data: data.values ?? [] }]}
        type="area"
        height={300}
      />
    </Flex>
  );
};

export default RefactorHistory;
