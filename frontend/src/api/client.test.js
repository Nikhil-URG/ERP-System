import { describe, it, expect, vi } from 'vitest';
import apiClient from './client';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('apiClient', () => {
  it('fetches users successfully', async () => {
    const mock = new MockAdapter(axios);
    const usersData = [{ id: 1, username: 'testuser', email: 'test@example.com' }];
    mock.onGet('http://localhost:8000/users/').reply(200, usersData);

    const response = await apiClient.get('/users/');
    expect(response.status).toBe(200);
    expect(response.data).toEqual(usersData);
  });

  it('handles fetch user error', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:8000/users/').reply(500);

    await expect(apiClient.get('/users/')).rejects.toThrow();
  });
});
