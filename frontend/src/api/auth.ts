import axiosClient from './axiosClient';
import type { AxiosResponse } from 'axios';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

type StoredDemoUser = {
  user: User;
  password: string;
};

const DEMO_USERS_KEY = 'demo_users_v1';

function loadDemoUsers(): StoredDemoUser[] {
  try {
    const raw = localStorage.getItem(DEMO_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredDemoUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDemoUsers(users: StoredDemoUser[]) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function makeDemoToken(user: User) {
  const raw = `${user.username}|${user.email}|${Date.now()}`;
  return `demo.${btoa(raw)}`;
}

function toAxiosResponse<T>(data: T): AxiosResponse<T> {
  // Minimal AxiosResponse shape needed by callers.
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosResponse<T>['config'],
  };
}

export async function loginUser(payload: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
  try {
    return await axiosClient.post<AuthResponse>('/auth/login', payload);
  } catch {
    const users = loadDemoUsers();
    const found = users.find(
      (u) =>
        (u.user.email?.toLowerCase() === payload.identifier.toLowerCase() ||
          u.user.username?.toLowerCase() === payload.identifier.toLowerCase()) &&
        u.password === payload.password
    );

    if (!found) {
      throw new Error('Invalid credentials (backend unreachable; checked local demo users).');
    }

    const token = makeDemoToken(found.user);
    return toAxiosResponse<AuthResponse>({ user: found.user, token });
  }
}

export async function registerUser(payload: RegisterRequest): Promise<AxiosResponse<AuthResponse>> {
  try {
    return await axiosClient.post<AuthResponse>('/auth/register', payload);
  } catch {
    const users = loadDemoUsers();
    const emailLower = payload.email.toLowerCase();
    const usernameLower = payload.username.toLowerCase();

    const exists = users.some(
      (u) => u.user.email.toLowerCase() === emailLower || u.user.username.toLowerCase() === usernameLower
    );
    if (exists) {
      throw new Error('User already exists (backend unreachable; checked local demo users).');
    }

    const now = new Date().toISOString();
    const user: User = {
      id: Math.floor(Math.random() * 1_000_000_000),
      email: payload.email,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role ?? 'STUDENT',
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };

    users.push({ user, password: payload.password });
    saveDemoUsers(users);

    const token = makeDemoToken(user);
    return toAxiosResponse<AuthResponse>({ user, token });
  }
}
