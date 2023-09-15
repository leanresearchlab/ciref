import React, { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { apiGithub, backendApi } from '@/services/api';
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
import FirstAccess from './first-access';
import { useSelectRepo } from '@/stores/repo';
import Profile from '@/components/Navbar/Profile';
import Image from 'next/image';
import RepoItem from '@/components/Navbar/RepoItem';
import Duel from '@/components/Duel';
import RefactoringsAuthors from '@/components/RefactoringsAuthors';
import { useTimeWindow } from '@/stores/timeWindow';
import TimeWindow from '@/components/TimeWindow';
import RefactorHistory from '@/components/RefactorHistory';
import RefactoringsTypes from '@/components/RefactoringsTypes';
import RefactoringsDrawer from '@/components/RefactoringsDrawer';
import RefactoringsPoints from '@/components/RefactoringsPoints';
import RefactoredFilesPath from '@/components/RefactoredFilesPath';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
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

function Dashboard() {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [firstAccess, setFirstAccess] = useState(false);
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

  const firstRepositoryId = repos.length > 0 ? repos[0].repoId : null;

  useEffect(() => {
    if (firstRepositoryId) {
      push(`/project/${firstRepositoryId}`)
    }
  }, [firstRepositoryId])

  return (
    <div>
      {repos.length ? (
        <Tag size="lg" variant="subtle">
          <TagLeftIcon boxSize="12px" as={Spinner} />
        </Tag>
      ) : (
        <FirstAccess setFirstAccess={setFirstAccess} />
      )}
    </div>
  )
};

export default Dashboard;
