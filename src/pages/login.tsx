import { Box, Button, Text } from '@chakra-ui/react';
import { getSession, signIn } from 'next-auth/react';
import { RiGithubFill, RiGithubLine } from 'react-icons/ri';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function Home() {
  return (
    <Box
      css={{
        margin: 0,
        boxSizing: 'border-box',
        width: '100%',
        outline: 'none',
        padding: 0,
        backgroundColor: '$gray50',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        css={{
          width: '320px',
          padding: '$8',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '$sm',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="https://user-images.githubusercontent.com/49327985/196309050-4515feb4-ef9c-4910-91f6-a078a95d1717.svg"
            style={{ width: '80px', height: '80px', marginBottom:'24px' }}
          ></img>
          {/* <img
            src="https://user-images.githubusercontent.com/49327985/196309098-f0041d73-d58d-493e-8cde-8dd67ac97604.svg"
            style={{ width: '100px', height: '100px' }}
          ></img> */}
        </div>
        <div>
          <Text
            fontSize="lg"
            marginBottom="8"
            textAlign="center"
          >
            Bem vindo(a) à ferramenta feita para você e as refatorações em seus
            projetos JAVA!
          </Text>
          <Text
            marginBottom="4"
            color={'#98A2B3'}
            css={{
              textAlign: 'center',
              marginBottom: '$4',
              color: '$gray600',
            }}
          >
            Clique abaixo para se autenticar com o Github
          </Text>
          <Button
            onClick={() => signIn('github')}
            size="lg"
            css={{ width: '100%',justifyContent: 'center'}}
          >
            {/* <LeftAdornment>
              <RiGithubFill size={20}/>
            </LeftAdornment> */}
            Conectar com o github
          </Button>
        </div>
      </Box>
    </Box>
  );
}
