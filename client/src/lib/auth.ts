import { apiRequest } from "./queryClient";
import type { User, Contractor } from "@shared/schema";

interface AuthState {
  user: User | null;
  contractor: Contractor | null;
  isAuthenticated: boolean;
}

class AuthService {
  private state: AuthState = {
    user: null,
    contractor: null,
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
    const response = await apiRequest("POST", "/api/auth/login", {
      username,
      password,
    });

    const data = await response.json();
    this.state = {
      user: data.user,
      contractor: data.contractor,
      isAuthenticated: true,
    };
    this.notify();
  }

  async register(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    phone?: string;
    location?: string;
  }): Promise<void> {
    const response = await apiRequest("POST", "/api/auth/register", userData);

    const data = await response.json();
    this.state = {
      user: data.user,
      contractor: null,
      isAuthenticated: true,
    };
    this.notify();
  }

  logout() {
    this.state = {
      user: null,
      contractor: null,
      isAuthenticated: false,
    };
    this.notify();
  }
}

export const authService = new AuthService();
