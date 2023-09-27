import { backendApi } from "@/services/api";
import { useSelectRepo } from "@/stores/repo";
import { useTimeWindow } from "@/stores/timeWindow";
import Image from "next/image";
import { Box, Divider, Flex, VStack, Text, Spacer, Tag, TagLeftIcon, Spinner, TagLabel } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import RepoItem from "@/components/Navbar/RepoItem";
import Profile from "@/components/Navbar/Profile";
import TimeWindow from "@/components/TimeWindow";
import RefactoringsDrawer from "@/components/RefactoringsDrawer";
import RefactorHistory from "@/components/RefactorHistory";
import RefactoringsAuthors from "@/components/RefactoringsAuthors";
import RefactoringsTypes from "@/components/RefactoringsTypes";
import RefactoringsPoints from "@/components/RefactoringsPoints";
import RefactoredFilesPath from "@/components/RefactoredFilesPath";
import Duel from "@/components/Duel";
import FirstAccess from "@/pages/first-access";
import Sidebar from "@/components/Sidebar";
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
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

export default function Project() {
  const { query } = useRouter();
  const { data: session } = useSession();
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

  const { data: alreadyRepos, refetch } = useQuery(
    ['alreadyRepos'],
    async () => {
      return backendApi
        .get(`/repo/${session?.user.username}`, {
          params: { startDate, endDate },
        })
        .then((response) => {
          const repoId = query?.id;
          const selected = response.data.find(repo => repo.repoId === repoId);
          if (!selectedRepo) setSelectedRepo(selected.repoUrl);
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
        <Sidebar createdRepos={repos} />
      </Box>
      <Flex p="8" w="100%">
        <Flex flexDir="column" gap={4} w="100%">
          <Flex w="100%">
            <TimeWindow />
            <Spacer></Spacer>
            {loading && (
              <Tag size="lg" variant="subtle">
                <TagLeftIcon boxSize="12px" as={Spinner} />
                <TagLabel>Syncing</TagLabel>
              </Tag>
            )}
            <RefactoringsDrawer />
          </Flex>
          <Flex gap={4} w="100%" flex={1}>
            <RefactorHistory />
          </Flex>
          <Flex gap={4} w="100%">
            <RefactoringsAuthors />
            <RefactoringsTypes />
            <RefactoringsPoints />
          </Flex>
          <Flex gap={4} w="100%">
            <RefactoredFilesPath />
          </Flex>
          <Flex gap={4} w="100%">
            <Duel />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}