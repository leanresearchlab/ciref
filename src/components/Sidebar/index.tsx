import { Box, Flex, VStack, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Divider, HStack, ModalFooter, useToast, useDisclosure } from "@chakra-ui/react";
import Profile from "../Navbar/Profile";
import RepoItem from "../Navbar/RepoItem";
import { RiCheckLine, RiGitRepositoryLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelectRepo } from "@/stores/repo";
import { useQuery } from "@tanstack/react-query";
import { apiGithub, backendApi } from "@/services/api";
import { useSession } from "next-auth/react";

type Repo = {
  id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  username: string;
  active: boolean;
};

interface SidebarProps {
  createdRepos: Repo[];
}

export default function Sidebar({ createdRepos }: SidebarProps) {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const alreadyRepos = useSelectRepo((state) => state.repos);

  const { data: repos, refetch } = useQuery(
    ['original-repos'],
    async () => {
      return apiGithub
        .get(`/users/${session?.user.username}/repos`)
        .then((a) => {
          const b = a.data.filter((i) => i.language === 'Java');
          const res = b.filter((a) => {
            return !alreadyRepos.find((e) => Number(e.repoId) === a.id);
          });

          return res;
        });
    },
    { initialData: [] }
  );
  
  useEffect(() => {
    refetch();
  }, [alreadyRepos]);

  function isSelected(repo: any) {
    const a = !!selectedRepos.find((r) => r.id === repo.id);
    return a;
  }

  function add(repo: any) {
    const findRepo = selectedRepos.find((r) => r.id === repo.id);
    if (findRepo) return;
    setSelectedRepos([...selectedRepos, repo]);
  }

  function remove(repo: any) {
    const findRepo = selectedRepos.find((r) => r.id === repo.id);
    if (!findRepo) return;
    setSelectedRepos(selectedRepos.filter((r) => r.id !== repo.id));
  }

  function handleCreateRepos() {
    setLoading(true);
    Promise.allSettled(
      selectedRepos.map((r) =>
        backendApi.post('/repo', {
          repoId: r.id,
          repoUrl: r.clone_url,
          repoName: r.name,
          username: session?.user.username,
        })
      )
    ).then((r) => toast({ title: 'Repositories added successfully' }));
    setLoading(false);
    onClose();
    router.push(`/project/${selectedRepos[0].id}`)
  }

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
            {createdRepos.length}
          </Flex>
        </Flex>
        {createdRepos.map((item) => (
          <RepoItem key={item.repoId} repoId={item.repoId} repoName={item.repoName} repoUrl={item.repoUrl} />
        ))}
      </VStack>
      <VStack w="100%" p="4" spacing="8">
        <Divider></Divider>
        <Button
          w="100%"
          onClick={onOpen}
          variant="outline"
          leftIcon={<RiGitRepositoryLine />}
          disabled={!repos.length}
        >
          Add Repository
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent width="100vw">
            <ModalHeader>Add repository</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>You can still add these repositories:</Text>
              <HStack mt="8" display="flex" flexDirection="column" gap="1">
                {repos.map((repo) => (
                  <Button
                    bg="transparent"
                    w="100%"
                    key={repo.id}
                    onClick={() => (!isSelected(repo) ? add(repo) : remove(repo))}
                    leftIcon={isSelected(repo) && <RiCheckLine />}
                  >
                    {repo.name}
                  </Button>
                ))}
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                variant="solid"
                isLoading={loading}
                onClick={() => handleCreateRepos()}
                colorScheme="purple"
              >
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Profile />
      </VStack>
    </>
  )
}