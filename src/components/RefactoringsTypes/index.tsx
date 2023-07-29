import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import { useTimeWindow } from '@/stores/timeWindow';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RefactoringsTypes: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    ['refacts-by-type'],
    async () => {
      const findRepoInfo = repos.find((r) => r.repoUrl === selectedRepo);
      return backendApi
        .get('/info', {
          params: {
            url: findRepoInfo.repoUrl,
            startDate,
            endDate,
          },
        })
        .then((res) => {
          const labels = Object.keys(res.data);
          const series = Object.values(res.data).map((i: any) => i.total);
          return { labels, series, original: res.data };
        });
    },
    { initialData: { labels: [], series: [], original: {} } }
  );
  useEffect(() => {
    refetch();
  }, [option, selectedRepo]);
  function handleSelectData(index: number) {
    setSelectedIndex(index);
  }
  return (
    <Box p="4" bg="white" borderRadius="md" w="100%">
      <Flex w="100%" align={'center'}>
        <Box>
          <Text fontWeight="semibold">Refactorings</Text>
          <Text fontSize="smaller">Refactorings by type of refactoring</Text>
        </Box>
        <Spacer />
        <Box>
          {selectedIndex !== -1 && (
            <Tag size="md" variant="subtle" colorScheme="purple">
              <TagLabel>{`${
                Object.keys(data.original)[selectedIndex]
              } type`}</TagLabel>
            </Tag>
          )}
        </Box>
      </Flex>
      <Divider />
      <Flex>
        <Chart
          options={{
            chart: {
              type: 'donut',
              width: 800,
              events: {
                dataPointMouseEnter: function (event, chartContext, config) {
                  handleSelectData(config.dataPointIndex);
                },
              },
            },
            labels: data.labels,
            tooltip:{enabled: false},
            theme: { monochrome: { enabled: true, color: '#6E51F2' } },
            dataLabels: {
              style: {
                fontSize: '14px',
                fontFamily: 'Outfit',
                fontWeight: 'bold',
                colors: ['white'],
              },
            },
            legend: { show: false },
            plotOptions: {
              pie: {
                donut: {
                  size: '65%',
                  background: '#e6e1fd',
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      fontSize: '22px',
                      fontFamily: 'Outfit, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#6E51F2',
                      offsetY: -10,
                      formatter: function (val) {
                        return `${val} refactorings`;
                      },
                    },
                    value: {
                      show: true,
                      fontSize: '16px',
                      fontFamily: 'Outfit, Arial, sans-serif',
                      fontWeight: 400,
                      color: '#6E51F2',
                      offsetY: 16,
                      formatter: function (val) {
                        return val;
                      },
                    },
                    total: {
                      show: true,
                      showAlways: false,
                      label: 'Total',
                      fontSize: '16px',
                      fontFamily: 'Outfit, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#6E51F2',
                      formatter: function (w) {
                        return w.globals.seriesTotals.reduce((a, b) => {
                          return a + b;
                        }, 0);
                      },
                    },
                  },
                },
              },
            },
          }}
          series={data.series ?? []}
          type="donut"
          width={350}
        />
        <Flex w="100%">
          {!Object.keys(data.original).length && (
            <Center flexDir={'column'}>
              <Image src="/assets/empty-box.png" width={100} height={100} />{' '}
              <Text>No data available</Text>
            </Center>
          )}
          {Object.keys(data.original).length && (
            <>
              <Divider orientation="vertical" h="100%" mr="4" />
              <VStack w="100%" mt="4">
                {selectedIndex === -1 && (
                  <Center>
                    <Text>Please select a type on the side</Text>
                  </Center>
                )}
                {selectedIndex !== -1 &&
                  data.original &&
                  Object.entries(
                    Object.values(data?.original)[selectedIndex] ?? {}
                  )
                    .slice(1)
                    .map((i, index) => (
                      <Flex key={index} w="100%" justifyContent="space-between">
                        <Text>{i[0]}</Text>
                        <Box>
                          <Badge
                            variant="outline"
                            textAlign="center"
                            colorScheme="purple"
                          >{`${i[1]} Refactorings`}</Badge>
                        </Box>
                      </Flex>
                    ))}
              </VStack>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default RefactoringsTypes;
