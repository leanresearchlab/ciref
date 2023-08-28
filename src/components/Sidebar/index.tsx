import { Box, Flex, VStack, Text, Image, Divider } from "@chakra-ui/react";
import Profile from "../Navbar/Profile";
import RepoItem from "../Navbar/RepoItem";

type Repo = {
  id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  username: string;
  active: boolean;
};

interface SidebarProps {
  repos: Repo[];
}

export default function Sidebar({ repos }: SidebarProps) {
  return (
    <>
      <VStack w="100%">
        <Flex
          w="100%"
          p="4"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="2xl" fontWeight="medium">
            Repositories
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
          <RepoItem key={item.repoId} repoId={item.repoId} repoName={item.repoName} repoUrl={item.repoUrl} />
        ))}
      </VStack>
      <Profile />
    </>
  )
}