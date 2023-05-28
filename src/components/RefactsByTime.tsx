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

const RefactsByTime: React.FC = () => {
  const { repos, selectedRepo } = useSelectRepo(({ repos, selectedRepo }) => ({
    repos,
    selectedRepo,
  }));
  const [startDate, endDate, option] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
    state.option,
  ]);
  const { data, isFetching, refetch } = useQuery(
    ['refacts-by-time'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);
      return backendApi
        .get('/refacts/time', {
          params: {
            repoId: findRepoInfo.repoId,
            startDate,
            endDate,
          },
        })
        .then((res) => {
          let dates = [];
          let values = [];
          res.data.forEach((i) => {
            dates.push(
              format(new Date(i.commit_date), "dd 'de' MMM,yyyy", {
                locale: ptBr,
              })
            );
            values.push(i._count.id);
          });
          return { dates, values };
        });
    },
    { initialData: { dates: [], values: [] } }
  );
  useEffect(() => {
    refetch();
  }, [option, selectedRepo]);

  return (
    <Flex w="100%" bg="white" p="4" borderRadius="md" flexDirection="column">
      <Box>
        <Text fontWeight="semibold">Refatorações</Text>
        <Text fontSize="smaller">
          Refatorações conforme o andamento do projeto
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
          },
          theme: { monochrome: { enabled: true, color: '#6E51F2' } },

          stroke: {
            curve: 'stepline',
          },
          grid: {
            xaxis:{
              lines:{
                show:true
              }
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          noData: { text: 'Sem dados' },
          xaxis: {
            categories: data.dates,
          },
        }}
        series={[{ name: 'Refatorações executadas', data: data.values ?? [] }]}
        type="area"
        height={300}
      />
    </Flex>
  );
};

export default RefactsByTime;
