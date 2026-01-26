import { createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  systemPreference: 'light' | 'dark';
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
  timestamp: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

// UI State types
export interface UIState {
  theme: ThemeState;
  notifications: NotificationState;
  loading: {
    global: boolean;
    components: Record<string, boolean>;
  };
  sidebar: {
    isOpen: boolean;
    isMobile: boolean;
  };
}

// Initial states
const initialThemeState: ThemeState = {
  mode: 'system',
  systemPreference: 'light',
};

const initialNotificationState: NotificationState = {
  notifications: [],
  maxNotifications: 5,
};

const initialUIState: UIState = {
  theme: initialThemeState,
  notifications: initialNotificationState,
  loading: {
    global: false,
    components: {},
  },
  sidebar: {
    isOpen: false,
    isMobile: false,
  },
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
    },
    toggleTheme: (state) => {
      if (state.mode === 'light') {
        state.mode = 'dark';
      } else if (state.mode === 'dark') {
        state.mode = 'system';
      } else {
        state.mode = 'light';
      }
    },
  },
});

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };

      // Add notification to the beginning of the array
      state.notifications.unshift(notification);

      // Remove oldest notifications if we exceed the max
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    setMaxNotifications: (state, action: PayloadAction<number>) => {
      state.maxNotifications = action.payload;
      // Trim notifications if needed
      if (state.notifications.length > action.payload) {
        state.notifications = state.notifications.slice(0, action.payload);
      }
    },
  },
});

// Loading slice
const loadingSlice = createSlice({
  name: 'loading',
  initialState: initialUIState.loading,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.global = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      const { component, loading } = action.payload;
      state.components[component] = loading;
    },
    clearComponentLoading: (state, action: PayloadAction<string>) => {
      delete state.components[action.payload];
    },
    clearAllComponentLoading: (state) => {
      state.components = {};
    },
  },
});

// Sidebar slice
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialUIState.sidebar,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

// Export actions
export const themeActions = themeSlice.actions;
export const notificationActions = notificationSlice.actions;
export const loadingActions = loadingSlice.actions;
export const sidebarActions = sidebarSlice.actions;

// Export selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectSidebar = (state: { ui: UIState }) => state.ui.sidebar;

// Selectors for specific values
export const selectThemeMode = (state: { ui: UIState }) => state.ui.theme.mode;
export const selectSystemPreference = (state: { ui: UIState }) => state.ui.theme.systemPreference;
export const selectActiveTheme = (state: { ui: UIState }) => 
  state.ui.theme.mode === 'system' ? state.ui.theme.systemPreference : state.ui.theme.mode;

export const selectAllNotifications = (state: { ui: UIState }) => state.ui.notifications.notifications;
export const selectNotificationById = (id: string) => (state: { ui: UIState }) =>
  state.ui.notifications.notifications.find(notification => notification.id === id);

export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.loading.global;
export const selectComponentLoading = (component: string) => (state: { ui: UIState }) =>
  state.ui.loading.components[component] || false;
export const selectAnyComponentLoading = (state: { ui: UIState }) =>
  Object.values(state.ui.loading.components).some(loading => loading);

export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebar.isOpen;
export const selectSidebarMobile = (state: { ui: UIState }) => state.ui.sidebar.isMobile;

// Export reducers
export const themeReducer = themeSlice.reducer;
export const notificationReducer = notificationSlice.reducer;
export const loadingReducer = loadingSlice.reducer;
export const sidebarReducer = sidebarSlice.reducer;

// Combined UI reducer
export const uiReducer = combineReducers({
  theme: themeReducer,
  notifications: notificationReducer,
  loading: loadingReducer,
  sidebar: sidebarReducer,
});
