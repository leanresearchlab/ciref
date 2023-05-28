import { apiGithub, backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import { Flex, Select, Spinner, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import RefactItem from './RefactItem';

const RefactContainer: React.FC<> = () => {
  const { data: session } = useSession();
  const [selectedRepo, setSelectedRepo] = useState('');
  const [repos, setRepos] = useState([]);
  const [ghRepos, setGHRepos] = useState([]);
  const [refacts, setRefacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedRepo: setSelectedRepoInfo } = useSelectRepo(
    ({ setSelectedRepo }) => ({ setSelectedRepo })
  );
  useEffect(() => {
    backendApi
      .get(`/repo/${session?.user.username}`)
      .then((response) => setRepos(response.data));
  }, []);

  useEffect(() => {
    apiGithub
      .get(`/users/${session?.user.username}/repos`)
      .then((response) => setGHRepos(response.data));
  }, []);

  useEffect(() => {
    if (selectedRepo !== '') {
      setRefacts([]);
      setLoading(true);
      backendApi
        .post('/refact', {
          name: selectedRepo,
          url: selectedRepo,
        })
        .then((response) => {
          setLoading(false);
          setRefacts(response.data);
        });
    }
  }, [selectedRepo]);

  return (
    <Flex flexDirection="column">
      <Select
        placeholder="Selecione o repositório"
        onChange={(e) => {
          setSelectedRepo(e.target.value);
          setSelectedRepoInfo(e.target.value);
        }}
      >
        {repos.map((repo) => (
          <option value={repo.repoUrl}>{repo.repoName}</option>
        ))}
      </Select>
      <VStack p="4">
        {loading && <Spinner />}
        {refacts.map((refact) => (
          <RefactItem
            refact={refact}
            repo={ghRepos.filter((repo) => repo.clone_url === selectedRepo)}
          />
        ))}
      </VStack>
    </Flex>
  );
};

export default RefactContainer;
