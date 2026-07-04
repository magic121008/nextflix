import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "user" | "admin";
  createdAt: string;
}

interface RegisteredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "nextflix_user";
const USERS_KEY = "nextflix_users";

/* ✅ ADMIN + USER ADDED */
const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "admin_1",
    email: "admin@nextflix.com",
    name: "Admin",
    avatar: "A",
    role: "admin",
    password: "admin123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_1",
    email: "user@nextflix.com",
    name: "Demo User",
    avatar: "D",
    role: "user",
    password: "user123",
    createdAt: new Date().toISOString(),
  },
];

/* ✅ GET USERS */
const getUsers = (): RegisteredUser[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);

    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

const saveUsers = (users: RegisteredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getSavedUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getSavedUser);

  /* ✅ LOGIN */
  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!found) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const { password: _, ...userData } = found;

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    return { success: true };
  }, []);

  /* ✅ REGISTER */
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const users = getUsers();

      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return {
          success: false,
          error: "Email already registered",
        };
      }

      const newUser: RegisteredUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        avatar: name.charAt(0).toUpperCase(),
        role: "user",
        password,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);

      const { password: _, ...userData } = newUser;

      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    },
    [],
  );

  /* ✅ LOGOUT */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
