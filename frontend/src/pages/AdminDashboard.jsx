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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useDisclosure,
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

const UserModal = ({ isOpen, onClose, user, onSave, isLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFullName(user.full_name || '');
      setRole(user.role);
    } else {
      setUsername('');
      setEmail('');
      setFullName('');
      setRole('user');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !role || (!user && !password)) {
        toast({
            title: "Missing fields",
            description: "Please fill in all required fields.",
            status: "warning",
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    onSave({ id: user?.id, username, email, full_name: fullName, role, password: password || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="rgba(255, 255, 255, 0.1)" backdropFilter="blur(10px)" border="1px solid rgba(255, 255, 255, 0.2)" borderRadius="xl" boxShadow="lg" color="whiteAlpha.900">
        <ModalHeader>{user ? 'Edit User' : 'Create User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} color="white" borderColor="whiteAlpha.400" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} color="white" borderColor="whiteAlpha.400" />
            </FormControl>
            <FormControl id="fullName">
              <FormLabel>Full Name</FormLabel>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} color="white" borderColor="whiteAlpha.400" />
            </FormControl>
            <FormControl id="role" isRequired>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)} color="white" borderColor="whiteAlpha.400">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>
            <FormControl id="password" isRequired={!user}>
              <FormLabel>Password {user ? '(Leave blank to keep current)' : ''}</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} color="white" borderColor="whiteAlpha.400" />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} colorScheme="whiteAlpha">Cancel</Button>
          <Button colorScheme="blue" ml={3} onClick={handleSubmit} isLoading={isLoading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const AttendanceModal = ({ isOpen, onClose, userId, username }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && userId) {
      setFetchLoading(true);
      apiClient.get(`/admin/users/${userId}/attendance`)
        .then(response => {
          setAttendanceRecords(response.data);
        })
        .catch(error => {
          console.error(`Failed to fetch attendance for user ${userId}`, error);
          toast({
            title: "Error fetching attendance.",
            description: error.response?.data?.detail || "Could not load attendance records.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [isOpen, userId, toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="rgba(255, 255, 255, 0.1)" backdropFilter="blur(10px)" border="1px solid rgba(255, 255, 255, 0.2)" borderRadius="xl" boxShadow="lg" color="whiteAlpha.900">
        <ModalHeader>Attendance for {username}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {fetchLoading ? (
            <Center><Spinner size="lg" /></Center>
          ) : attendanceRecords.length === 0 ? (
            <Text textAlign="center">No attendance records found for this user.</Text>
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
                  {attendanceRecords.map((record) => (
                    <Tr key={record.id}>
                      <Td>{new Date(record.check_in).toLocaleString()}</Td>
                      <Td>{record.check_out ? new Date(record.check_out).toLocaleString() : <Tag size="sm" colorScheme="yellow">Active</Tag>}</Td>
                      <Td isNumeric>{record.total_hours ? record.total_hours.toFixed(2) : 'N/A'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="whiteAlpha" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen: isUserModalOpen, onOpen: onUserModalOpen, onClose: onUserModalClose } = useDisclosure();
  const { isOpen: isAttendanceModalOpen, onOpen: onAttendanceModalOpen, onClose: onAttendanceModalClose } = useDisclosure();

  const [currentUserForEdit, setCurrentUserForEdit] = useState(null);
  const [selectedUserIdForAttendance, setSelectedUserIdForAttendance] = useState(null);
  const [selectedUsernameForAttendance, setSelectedUsernameForAttendance] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      toast({
        title: 'Error loading users.',
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
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setCurrentUserForEdit(null);
    onUserModalOpen();
  };

  const handleEditUser = (user) => {
    setCurrentUserForEdit(user);
    onUserModalOpen();
  };

  const handleSaveUser = async (userData) => {
    setSaveLoading(true);
    try {
      if (userData.id) {
        await apiClient.put(`/admin/users/${userData.id}`, userData);
        toast({
          title: 'User updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiClient.post('/admin/users', userData);
        toast({
          title: 'User created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onUserModalClose();
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
      toast({
        title: 'Error saving user.',
        description: error.response?.data?.detail || 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiClient.delete(`/admin/users/${userId}`);
        toast({
          title: 'User deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
        toast({
          title: 'Error deleting user.',
          description: error.response?.data?.detail || 'An error occurred.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  
  const handleViewAttendance = (userId, username) => {
    setSelectedUserIdForAttendance(userId);
    setSelectedUsernameForAttendance(username);
    onAttendanceModalOpen();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Center minH="100vh" bgGradient="linear(to-br, #E53E3E, #DD6B20)">
        <Spinner size="xl" color="white" />
      </Center>
    );
  }

  return (
    <Center minH="100vh" bgGradient="linear(to-br, #E53E3E, #DD6B20)" p={4}>
      <VStack spacing={6} w="full" maxW="6xl">
        <GlassBox w="full" display="flex" justifyContent="space-between" alignItems="center">
          <Heading as="h2" size="xl">Admin Dashboard</Heading>
          <Button onClick={handleLogout} colorScheme="red" variant="outline">
            Logout
          </Button>
        </GlassBox>

        <GlassBox w="full">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Heading as="h3" size="md">All Users</Heading>
            <Button onClick={handleCreateUser} colorScheme="blue">Create New User</Button>
          </Box>
          {users.length === 0 ? (
            <Text textAlign="center">No users found.</Text>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="whiteAlpha.700">Username</Th>
                    <Th color="whiteAlpha.700">Email</Th>
                    <Th color="whiteAlpha.700">Full Name</Th>
                    <Th color="whiteAlpha.700">Role</Th>
                    <Th color="whiteAlpha.700">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.full_name || 'N/A'}</Td>
                      <Td><Tag size="sm" colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>{user.role}</Tag></Td>
                      <Td>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
                            <Button size="xs" colorScheme="blue" onClick={() => handleEditUser(user)}>Edit</Button>
                            <Button size="xs" colorScheme="red" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            <Button size="xs" colorScheme="green" onClick={() => handleViewAttendance(user.id, user.username)}>Attendance</Button>
                        </Stack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </GlassBox>

        <UserModal
          isOpen={isUserModalOpen}
          onClose={onUserModalClose}
          user={currentUserForEdit}
          onSave={handleSaveUser}
          isLoading={saveLoading}
        />

        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={onAttendanceModalClose}
          userId={selectedUserIdForAttendance}
          username={selectedUsernameForAttendance}
        />
      </VStack>
    </Center>
  );
};

export default AdminDashboard;
