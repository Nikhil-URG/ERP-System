import React, { useState } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  // FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  useToast,
  Spinner,
  Center
} from "@chakra-ui/react";

import { FormControl } from '@chakra-ui/react';

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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/login',
        new URLSearchParams({ username, password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      localStorage.setItem('token', response.data.access_token);
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh" bgGradient="linear(to-br, #805AD5, #3182CE)">
      <GlassBox w="full" maxW="md">
        <Stack spacing={4}>
          <Heading as="h2" size="xl" textAlign="center" color="whiteAlpha.900">
            Login
          </Heading>
          <form onSubmit={handleLogin}>
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
                  _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #90CDF4' }}
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
                  _focus={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #90CDF4' }}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Logging in..."
                mt={4}
                bg="blue.500"
                _hover={{ bg: 'blue.600' }}
                _active={{ bg: 'blue.700' }}
              >
                Login
              </Button>
            </Stack>
          </form>
          <Text textAlign="center" color="whiteAlpha.800">
            Don't have an account?{' '}
            <Link as={ReactRouterLink} to="/signup" color="blue.300">
              Sign up
            </Link>
          </Text>
        </Stack>
      </GlassBox>
    </Center>
  );
};

export default Login;
