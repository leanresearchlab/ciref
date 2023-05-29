import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import { useTimeWindow } from '@/stores/timeWindow';
import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { categories } from './Duel';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// import { Container } from './styles';

const RefactsPaths: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedRepo = useSelectRepo((state) => state.selectedRepo);
  const [startDate, endDate, option] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
    state.option,
  ]);
  const { data, refetch } = useQuery(
    ['refactorings-paths'],
    () => {
      return backendApi
        .get('refacts/paths', {
          params: { repoUrl: selectedRepo, startDate, endDate },
        })
        .then((res) => res.data);
    },
    { initialData: [] }
  );

  useEffect(() => {
    refetch();
  }, [option, selectedRepo]);

  return (
    <Flex bg="white" width="100%" boxSizing="border-box" display="flex">
      <Chart
        width={'1020px'}
        options={{
          chart: {
            type: 'bar',
            height: 350,
            width: '100%',
            events: {
              dataPointSelection: function (event, chartContext, config) {
                setSelectedIndex(config.dataPointIndex);
              },
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: true,
              columnWidth: '60%',
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => `${val}x`,
          },
          colors: ['#6E51F2'],
          xaxis: {
            categories: Object.entries(data)
              .sort((a: any, b: any) => b[1].total - a[1].total)
              .slice(0, 10)
              .map((i) => i[0]),
            labels: {
              minWidth: 500,
            },
          },
          yaxis: {
            reversed: true,
          },
        }}
        series={[
          {
            data: Object.values(data)
              .sort((a: any, b: any) => b.total - a.total)
              .slice(0, 10)
              .map((i) => i.total),
          },
        ]}
        type="bar"
        height={350}
      />
      {selectedIndex !== -1 && (
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
                  strokeColor: '#e8e8e8',
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
            {
              name: Object.keys(data)[selectedIndex] ?? 'opa',
              data:
                Object.keys(data).length > 0
                  ? Object.entries(Object.values(data)[selectedIndex]).map(
                      (i) => i[1]
                    )
                  : [],
            },
          ]}
          type="radar"
          height={350}
        />
      )}
    </Flex>
  );
};

export default RefactsPaths;
