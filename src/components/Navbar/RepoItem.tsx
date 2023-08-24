import { useSelectRepo } from '@/stores/repo';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { RiGitRepositoryLine } from 'react-icons/ri';

interface RepoItem {
  repoName: string;
  repoUrl: string;
  repoId: number;
}

const RepoItem: React.FC<RepoItem> = ({ repoName,repoUrl, repoId }) => {
  const { selectedRepo, setSelectedRepo } = useSelectRepo(
    ({ selectedRepo, setSelectedRepo }) => ({
      selectedRepo,
      setSelectedRepo,
    })
  );
  const active = repoUrl === selectedRepo;
  const router = useRouter();

  return (
    <Flex
      pos="relative"
      w="100%"
      h="64px"
      align="center"
      justify="center"
      cursor="pointer"
      onClick={() => {
        setSelectedRepo(repoUrl)
        router.push(`/project/${repoId}`)
      }}
      bgGradient={
        active ? 'linear(to-r, primary.50, transparent)' : 'transparent'
      }
    >
      <Box
        display={active ? 'block' : 'none'}
        pos="absolute"
        left={0}
        w="5px"
        h="100%"
        bg="primary.500"
      />
      <Flex align="center" justify="flex-start" ml="4" w="100%">
        <Icon
          mr="4"
          as={RiGitRepositoryLine}
          color={active ? 'primary.500' : 'gray.400'}
          width={30}
          height={30}
        />
        <Text
          color={active ? 'primary.500' : 'gray.400'}
          fontSize="2xl"
          fontWeight={active ? 'medium' : 'regular'}
        >
          {repoName}
        </Text>
      </Flex>
    </Flex>
  );
};

export default RepoItem;
