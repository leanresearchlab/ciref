import { backendApi } from '@/services/api';
import { useSelectRepo } from '@/stores/repo';
import { useCreateWeights } from '@/stores/weights';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { RiListOrdered } from 'react-icons/ri';

const RefactoringsDrawer: React.FC = () => {
  const [weights, setWeights, reset] = useCreateWeights((state) => [
    state.weights,
    state.setWeights,
    state.reset,
  ]);
  const [selectedRepo] = useSelectRepo((state) => [state.selectedRepo]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const btnRef = useRef();
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'smaller',
  };
  const { data, isLoading } = useQuery(
    ['repo-weights'],
    async () => {
      return (
        await backendApi.get('/weights', { params: { repoUrl: selectedRepo } })
      ).data;
    },
    { initialData: {} }
  );
  const queryClient = useQueryClient();

  async function handleCreateWeights() {
    try {
      setLoading(true);
      const weightsFormatted = [
        'add',
        'change',
        'extract',
        'inline',
        'merge',
        'modify',
        'move',
        'remove',
        'rename',
        'replace',
        'split',
      ].reduce((acc, item) => {
        const findNewWeight = weights.find((e) => e.key.toLowerCase() === item);

        if (findNewWeight) return { ...acc, [item]: findNewWeight.value };
        return {
          ...acc,
          [item.toLowerCase()]: data ? data[item.toLowerCase()] : 1,
        };
      }, {});

      await backendApi.post('/weights', {
        repoUrl: selectedRepo,
        weights: weightsFormatted,
      });
      setLoading(false);
      queryClient.invalidateQueries(['refacts-by-authors-points']);
      queryClient.invalidateQueries(['repo-weights']);
      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button
        ref={btnRef}
        onClick={() => {
          onOpen();
          reset();
        }}
        leftIcon={<RiListOrdered />}
        colorScheme="primary"
        variant="solid"
        size="md"
      >
        Refactorings weights
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          reset();
          onClose();
        }}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>The importance of refactoring</DrawerHeader>

          <DrawerBody>
            <VStack w="100%">
              <Alert
                status="info"
                borderRadius="md"
                colorScheme="primary"
                variant="solid"
              >
                <AlertIcon />
                Below, select the respective weights to determine 
                the relevance of the types of refactoring within this project.
              </Alert>
              {[
                'Move',
                'Rename',
                'Modify',
                'Extract',
                'Change',
                'Rename',
                'Add',
                'Remove',
              ].map((i) => (
                <SimpleGrid
                  as={Flex}
                  alignItems="center"
                  w="100%"
                  columns={2}
                  h="12"
                  key={i}
                >
                  <Text>{i}</Text>
                  <Slider
                    onChangeEnd={(v) => setWeights({ key: i, value: v })}
                    defaultValue={data[i.toLowerCase()]}
                    min={1}
                    max={5}
                    step={1}
                  >
                    <SliderMark value={1} {...labelStyles}>
                      1x
                    </SliderMark>
                    <SliderMark value={2} {...labelStyles}>
                      2x
                    </SliderMark>
                    <SliderMark value={3} {...labelStyles}>
                      3x
                    </SliderMark>
                    <SliderMark value={4} {...labelStyles}>
                      4x
                    </SliderMark>
                    <SliderMark value={5} {...labelStyles}>
                      5x
                    </SliderMark>
                    <SliderTrack bg="purple.100">
                      <Box position="relative" right={10} />
                      <SliderFilledTrack bg="primary.500" />
                    </SliderTrack>
                    <SliderThumb boxSize={3} bg="primary.500" />
                  </Slider>
                </SimpleGrid>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              isLoading={loading}
              onClick={() => handleCreateWeights()}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default RefactoringsDrawer;
