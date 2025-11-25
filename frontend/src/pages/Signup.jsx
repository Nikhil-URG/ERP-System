import React, { useState } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  useToast,
  Center,
} from '@chakra-ui/react';
import apiClient from '../api/client';

const GlassBox = ({ children, ...props }) => (
  <Box
    bg="rgba(255, 255, 255, 0.1)"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255, 255, 255, 0.2)"
    borderRadius="xl"
    boxShadow="lg"
    p={8}
    {...props}
  >
    {children}
  </Box>
);

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/signup', { username, email, password, full_name: fullName });
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Signup Failed',
        description: err.response?.data?.detail || 'An error occurred during signup.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh" bgGradient="linear(to-br, #38A169, #319795)">
      <GlassBox w="full" maxW="md">
        <Stack spacing={4}>
          <Heading as="h2" size="xl" textAlign="center" color="whiteAlpha.900">
            Sign Up
          </Heading>
          <form onSubmit={handleSignup}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel color="whiteAlpha.800">Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.600' }}
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'whiteAlpha.600' }}
                  _focus={{ borderColor: 'green.300', boxShadow: '0 0 0 1px #68D391' }}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel color="whiteAlpha.800">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.600' }}
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'whiteAlpha.600' }}
                  _focus={{ borderColor: 'green.300', boxShadow: '0 0 0 1px #68D391' }}
                />
              </FormControl>
              <FormControl id="fullName">
                <FormLabel color="whiteAlpha.800">Full Name (Optional)</FormLabel>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.600' }}
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'whiteAlpha.600' }}
                  _focus={{ borderColor: 'green.300', boxShadow: '0 0 0 1px #68D391' }}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel color="whiteAlpha.800">Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  color="white"
                  _placeholder={{ color: 'whiteAlpha.600' }}
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'whiteAlpha.600' }}
                  _focus={{ borderColor: 'green.300', boxShadow: '0 0 0 1px #68D391' }}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={loading}
                loadingText="Signing up..."
                mt={4}
                bg="green.500"
                _hover={{ bg: 'green.600' }}
                _active={{ bg: 'green.700' }}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
          <Text textAlign="center" color="whiteAlpha.800">
            Already have an account?{' '}
            <Link as={ReactRouterLink} to="/login" color="green.300">
              Login
            </Link>
          </Text>
        </Stack>
      </GlassBox>
    </Center>
  );
};

export default Signup;
