import { apiGithub } from '@/services/api';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Octokit, App } from 'octokit';
import {
  RiCheckLine,
  RiFileCopyFill,
  RiGitPullRequestFill,
} from 'react-icons/ri';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';

interface RefactItemProps {
  refact: any;
  repo: any;
}

const octokit = new Octokit({
  auth: `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`,
});

const RefactItem: React.FC<RefactItemProps> = ({ refact, repo }) => {
  const { data } = useSession();
  const toast = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [findBranch, setFindBranch] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleCreatePR() {
    const owner = repo[0].owner?.login;
    const repoName = repo[0].name;
    const refResponse = await apiGithub.get(
      `/repos/${owner}/${repoName}/git/refs/heads/FIX123-move-method`
    );
    // const sha = refResponse.data.object.sha;
    // const newBranchRef = await octokit.rest.git.createRef({
    //   owner,
    //   repo: repoName,
    //   ref: 'refs/head/opaa',
    //   sha: sha,
    // });
    const currentCommit = await apiGithub.get(
      `/repos/${owner}/${repoName}/git/commits/${refResponse.data.object.sha}`
    );
    const newCommit = await apiGithub.post(
      `/repos/${owner}/${repoName}/git/commits`,
      {
        message: 'Teste de commit',
        tree: currentCommit.data.tree.sha,
        parents: [currentCommit.data.sha],
      }
    );
    const a = await apiGithub.get(
      `/repos/${owner}/${repoName}/git/commits/${newCommit.data.sha}`
    );
    // const refs = await apiGithub.get(
    //   `/repos/${owner}/${repoName}/git/matching-refs/`
    // );
    await apiGithub.patch(`/repos/${owner}/${repoName}/git/refs/heads/FIX123-move-method`, {
      sha: a.data.sha,
    });
    const resp = await apiGithub.post(`/repos/${owner}/${repoName}/pulls`, {
      title: 'Test',
      body: 'test',
      base: 'master',
      head: `${owner}:FIX123-move-method`,
    });
  }

  const findExistingBranches = async () => {
    try {
      const response = await apiGithub.get(
        `/repos/${repo[0].owner.login}/${repo[0].name}/branches/FIX123-move-method`
      );
      setFindBranch(true);
    } catch (error) {
      toast({
        status: 'error',
        variant: 'solid',
        title: 'Não conseguimos encontrar a branch :/',
        description:
          'Confira se criou uma branch com o nome FIX123-move-method',
      });
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      outline="1px solid"
      outlineColor={'#344054'}
      p="4"
    >
      <div>
        <Text fontWeight="bold">{refact.type}</Text>
        <Text fontSize="smaller" color={'#98A2B3'}>
          {refact.description}
        </Text>
      </div>
      <Button
        variant="outline"
        leftIcon={<RiGitPullRequestFill />}
        onClick={() => onOpen()}
      >
        Criar PR
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criação da PR</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Vamos começar!</Text>
            <Text>
              Copie o nome da branch disponibilizado abaixo, e crie a branch{' '}
              <Link
                color="gray.400"
                href={`${repo[0].html_url}/branches`}
                isExternal
              >
                aqui
              </Link>
            </Text>
            <VStack>
              <InputGroup size="md">
                <Input pr="4.5rem" value="FIX123-move-method" readOnly />
                <InputRightElement>
                  <Tooltip label="Copiar">
                    <IconButton
                      size="sm"
                      icon={<RiFileCopyFill />}
                      onClick={() => {
                        toast({
                          status: 'success',
                          variant: 'left-accent',
                          title: 'Nome da branch copiado com sucesso!',
                          description:
                            'Agora você já pode criar a branch com esse valor',
                        });
                        navigator.clipboard.writeText('FIX123-move-method');
                      }}
                    />
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
              {!findBranch && (
                <Button onClick={() => findExistingBranches()} w="100%">
                  Já criei a branch
                </Button>
              )}
              {findBranch && (
                <Alert
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  borderRadius="md"
                >
                  <AlertIcon boxSize="30px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="md">
                    Tudo certo!
                  </AlertTitle>
                  <AlertDescription maxWidth="x-small">
                    Para prosseguir, basta clicar no botão abaixo 'Criar Pull
                    Request'
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Button onClick={onClose} variant="ghost">
                Cancelar
              </Button>{' '}
              <Button
                colorScheme="gray"
                mr={3}
                onClick={() => handleCreatePR()}
              >
                Criar Pull Request
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default RefactItem;
