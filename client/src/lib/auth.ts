import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      this.state.user = response.user;
      this.state.isAuthenticated = true;
      this.notify();
    } catch (error) {
      throw error;
    }
  }

  async register(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    companyName?: string;
    role?: string;
    phone?: string;
    location?: string;
  }): Promise<void> {
    try {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      this.state.user = response.user;
      this.state.isAuthenticated = true;
      this.notify();
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
    };
    this.notify();
  }
}

export const authService = new AuthService();