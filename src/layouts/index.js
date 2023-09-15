import { Box, Flex, Heading, Image, Link, VStack } from "@chakra-ui/react";
import { ProdeProvider } from "../logic/ProdeContext";

const FooterLink = ({ link, text, left, title }) => {
  return (
    <Link
      href={link}
      isExternal
      display="flex"
      alignItems="center"
      title={title}
    >
      {left}
      <Heading color="gray.600" fontSize="md" ml={2}>
        {text}
      </Heading>
    </Link>
  );
};

function MainLayout(props) {
  const { children } = props;
  return (
    <>
      <Box p={6} minH="99vh">
        <Heading>prode.click</Heading>
        <Heading color="gray.600" fontSize="xl">
          Elecciones Generales 2023 🇦🇷
        </Heading>

        <VStack spacing={6} py={6}>
          {children}
        </VStack>
      </Box>
      <Flex
        position="absolute"
        bottom={0}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        px={2}
      >
        <Flex gap={4} alignItems="center">
          {/* <FooterLink
            text="source code"
            link="https://github.com/fdelmazo/prode"
            left={<Icon boxSize={6} as={BsGithub} />}
          />
          • */}
          <FooterLink
            text="fede.dm"
            link="https://fede.dm"
            left={
              <Image src="img/deadmona.png" boxSize={7} display={"inline"} />
            }
          />
        </Flex>
        <FooterLink
          text=""
          title="invitame un cafecito"
          link="https://cafecito.app/fdelmazo"
          left={<Image src="img/cafecito.png" boxSize={9} display={"inline"} />}
        />
      </Flex>
    </>
  );
}

export default function Layout(props) {
  return (
    <ProdeProvider>
      <MainLayout {...props} />
    </ProdeProvider>
  );
}
