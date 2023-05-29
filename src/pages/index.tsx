import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { backendApi } from '@/services/api';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Spacer,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
} from '@chakra-ui/react';
import FirstAccess from '@/components/FirstAccess';
import { useSelectRepo } from '@/stores/repo';
import Profile from '@/components/navbar/Profile';
import Image from 'next/image';
import RepoItem from '@/components/navbar/RepoItem';
import Duel from '@/components/Duel';
import RefactByAuthors from '@/components/RefactsByAuthors';
import TimeWindows from '@/components/TimeWindows';
import { useTimeWindow } from '@/stores/timeWindow';
import RefactsByTime from '@/components/RefactsByTime';
import RefactsByType from '@/components/RefactsByType';
import { RiListOrdered } from 'react-icons/ri';
import RefactsOrderDrawer from '@/components/RefactsOrderDrawer';
import RefactByAuthorsPoints from '@/components/RefactsByAuthorsPoints';
import RefactsPaths from '@/components/RefactsPaths';
import { useQuery, useQueryClient } from '@tanstack/react-query';
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [firstAccess, setFirstAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, endDate] = useTimeWindow((state) => [
    state.startDate,
    state.endDate,
  ]);
  const { selectedRepo, setSelectedRepo, setRepos, repos } = useSelectRepo(
    ({ selectedRepo, setSelectedRepo, setRepos, repos }) => ({
      selectedRepo,
      repos,
      setSelectedRepo,
      setRepos,
    })
  );
  const queryClient = useQueryClient();
  const [refactsTypes, setRefactsTypes] = useState(false);

  useEffect(() => {
    if (session?.user) {
      backendApi
        .get(`/user/${session?.user.username}`)
        .then((a) => setFirstAccess(a.data.firstAccess));
    }
  }, []);

  const { data: alreadyRepos, refetch } = useQuery(
    ['alreadyRepos'],
    async () => {
      return backendApi
        .get(`/repo/${session?.user.username}`, {
          params: { startDate, endDate },
        })
        .then((response) => {
          if (!selectedRepo) setSelectedRepo(response.data[0]?.repoUrl);
          return response.data;
        });
    },
    { initialData: [] }
  );
  useEffect(() => {
    setRepos(alreadyRepos);
  }, [alreadyRepos]);

  useEffect(() => {
    if (selectedRepo !== '') {
      setLoading(true);
      backendApi
        .post('/refact', {
          username: session?.user.username,
          url: selectedRepo,
          branch: 'master',
        })
        .then((e) => {
          setLoading(false);
          queryClient.invalidateQueries();
        });
      backendApi
        .get(`/info/`, { params: { url: selectedRepo } })
        .then((a) => setRefactsTypes(a.data));
    }
  }, [selectedRepo]);

  return (
    <Box margin={0} padding={0} boxSizing="border-box" display="flex" width="100">
      <Box
        bg="white"
        width="30vw"
        maxWidth="300px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <Flex flexDir="column" p="4" w="100%">
          <Image src="/assets/logo.svg" width={80} height={80} />
        </Flex>
        <Divider />

        <VStack w="100%">
          <Flex
            w="100%"
            p="4"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="2xl" fontWeight="medium">
              Repositórios
            </Text>
            <Flex
              bg="primary.50"
              color="primary.500"
              w="8"
              h="8"
              borderRadius="xl"
              justifyContent="center"
              alignItems="center"
            >
              {repos.length}
            </Flex>
          </Flex>
          {repos.map((item) => (
            <RepoItem repoName={item.repoName} repoUrl={item.repoUrl} />
          ))}
        </VStack>
        <Profile />
      </Box>
      <Flex p="8" w="100%">
        {repos.length ? (
          <Flex flexDir="column" gap={4} w="100%">
            <Flex w="100%">
              <TimeWindows />
              <Spacer></Spacer>
              {loading && (
                <Tag size="lg" variant="subtle">
                  <TagLeftIcon boxSize="12px" as={Spinner} />
                  <TagLabel>Sincronizando</TagLabel>
                </Tag>
              )}
              <RefactsOrderDrawer />
            </Flex>
            <Flex gap={4} w="100%" flex={1}>
              <RefactsByTime />
            </Flex>
            <Flex gap={4} w="100%">
              <RefactByAuthors />
              <RefactsByType />
              <RefactByAuthorsPoints />
            </Flex>
            <Flex gap={4} w="100%">
              <RefactsPaths />
            </Flex>
            <Flex gap={4} w="100%">
              <Duel />
            </Flex>
          </Flex>
        ) : (
          <FirstAccess setFirstAccess={setFirstAccess} />
        )}
      </Flex>
    </Box>
  );
};

export default Home;
