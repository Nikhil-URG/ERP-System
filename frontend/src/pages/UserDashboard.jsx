import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Center,
  SimpleGrid
} from '@chakra-ui/react';
import apiClient from '../api/client';

const GlassBox = ({ children, ...props }) => (
  <Box
    bg="rgba(255, 255, 255, 0.1)"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255, 255, 255, 0.2)"
    borderRadius="xl"
    boxShadow="lg"
    p={6}
    color="whiteAlpha.900"
    {...props}
  >
    {children}
  </Box>
);

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userResponse = await apiClient.get('/user/me');
      setUser(userResponse.data);
      const attendanceResponse = await apiClient.get('/user/attendance/last10');
      setAttendance(attendanceResponse.data);
      const activeCheckIn = attendanceResponse.data.find(att => att.check_out === null);
      setIsCheckedIn(!!activeCheckIn);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      toast({
        title: 'Error loading data.',
        description: 'Please try logging in again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCheckIn = async () => {
    setButtonLoading(true);
    try {
      await apiClient.post('/user/attendance/check-in');
      toast({
        title: 'Checked In!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      await fetchUserData();
    } catch (error) {
      console.error('Check-in failed', error);
      toast({
        title: 'Check-in failed.',
        description: error.response?.data?.detail || 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setButtonLoading(true);
    try {
      await apiClient.post('/user/attendance/check-out');
      toast({
        title: 'Checked Out!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      await fetchUserData();
    } catch (error) {
      console.error('Check-out failed', error);
      toast({
        title: 'Check-out failed.',
        description: error.response?.data?.detail || 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setButtonLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Center minH="100vh" bgGradient="linear(to-br, #805AD5, #3182CE)">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <Center minH="100vh" bgGradient="linear(to-br, #805AD5, #3182CE)" p={4}>
      <VStack spacing={6} w="full" maxW="5xl">
        <GlassBox w="full" display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h2" size="xl">User Dashboard</Heading>
          <Button onClick={handleLogout} colorScheme="red" variant="outline">
            Logout
          </Button>
        </GlassBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <GlassBox>
            <Heading as="h3" size="md" mb={4}>Your Information</Heading>
            <Text>Welcome, <Text as="span" fontWeight="bold">{user.username}</Text>!</Text>
            <Text>Email: {user.email}</Text>
            <Text>Role: <Tag size="md" variant="solid" colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>{user.role}</Tag></Text>
          </GlassBox>

          <GlassBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Heading as="h3" size="md" mb={4}>Time Tracking</Heading>
            <Button
              size="lg"
              colorScheme={isCheckedIn ? 'orange' : 'green'}
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              isLoading={buttonLoading}
              loadingText={isCheckedIn ? 'Checking out...' : 'Checking in...'}
            >
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Button>
          </GlassBox>
        </SimpleGrid>

        <GlassBox w="full">
          <Heading as="h3" size="md" mb={4}>Last 10 Attendance Records</Heading>
          {attendance.length === 0 ? (
            <Text textAlign="center">No attendance records found.</Text>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="whiteAlpha.700">Check-In Time</Th>
                    <Th color="whiteAlpha.700">Check-Out Time</Th>
                    <Th color="whiteAlpha.700" isNumeric>Total Hours</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {attendance.map((att) => (
                    <Tr key={att.id}>
                      <Td>{new Date(att.check_in).toLocaleString()}</Td>
                      <Td>{att.check_out ? new Date(att.check_out).toLocaleString() : <Tag size="sm" colorScheme="yellow">Active</Tag>}</Td>
                      <Td isNumeric>{att.total_hours ? att.total_hours.toFixed(2) : 'N/A'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </GlassBox>
      </VStack>
    </Center>
  );
};

export default UserDashboard;
