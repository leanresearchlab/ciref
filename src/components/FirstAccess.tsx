import { apiGithub, backendApi } from '@/services/api';
import { Button, Flex, HStack, Spacer, Text, useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RiCheckLine } from 'react-icons/ri';

interface FirstAccessProps {
  setFirstAccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const FirstAccess: React.FC<FirstAccessProps> = ({ setFirstAccess }) => {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const queryClient = useQueryClient()
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
          username: session?.user?.username,
        })
      )
    ).then((r) => {
      toast({ title: 'Repositórios adicionados com sucesso' });
      queryClient.invalidateQueries()
      router.reload();
    });
    setLoading(false);
    setFirstAccess(true);
  }

  useEffect(() => {
    apiGithub
      .get(`/users/${session?.user.username}/repos`)
      .then((a) => setRepos(a.data.filter((i) => i.language === 'Java')));
  }, []);

  return (
    <Flex
      flexDirection="column"
      h="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="2xl">Bem vindo! Este é seu primeiro acesso!</Text>
      <Text color={'#98A2B3'}>
        Escolha abaixo dentre os seus repositórios JAVA, quais você deseja que o
        ciref seja executado.
      </Text>
      <HStack mt="8" display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="1rem">
        {repos.map((repo) => (
          <Button
            key={repo.id}
            onClick={() => (!isSelected(repo) ? add(repo) : remove(repo))}
            leftIcon={isSelected(repo) && <RiCheckLine />}
          >
            {repo.name}
          </Button>
        ))}
      </HStack>
      <Button
        mt="16"
        width="40%"
        colorScheme="purple"
        isLoading={loading}
        onClick={() => handleCreateRepos()}
      >
        Enviar
      </Button>
    </Flex>
  );
};

export default FirstAccess;
