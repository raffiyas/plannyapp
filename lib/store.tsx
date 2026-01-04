'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Client, ActionItem, Stage, Potential } from '@/types';
import { clients as seedClients, actions as seedActions } from '@/data/seed';
import { todayISO, formatDateLabel } from './date';

// Storage keys
const STORAGE_KEYS = {
  CLIENTS: 'planny_clients',
  ACTIONS: 'planny_actions',
};

// State interface
interface StoreState {
  clients: Client[];
  actions: ActionItem[];
  isHydrated: boolean;
}

// Action types
type StoreAction =
  | { type: 'HYDRATE'; payload: { clients: Client[]; actions: ActionItem[] } }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; updates: Partial<Client> } }
  | { type: 'ADD_ACTION'; payload: ActionItem }
  | { type: 'TOGGLE_ACTION_DONE'; payload: string }
  | { type: 'UPDATE_ACTION'; payload: { id: string; updates: Partial<ActionItem> } };

// Reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        clients: action.payload.clients,
        actions: action.payload.actions,
        isHydrated: true,
      };

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id
            ? { ...client, ...action.payload.updates }
            : client
        ),
      };

    case 'ADD_ACTION':
      return {
        ...state,
        actions: [...state.actions, action.payload],
      };

    case 'TOGGLE_ACTION_DONE':
      return {
        ...state,
        actions: state.actions.map((item) =>
          item.id === action.payload
            ? { ...item, done: !item.done }
            : item
        ),
      };

    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    default:
      return state;
  }
}

// Context
interface StoreContextValue extends StoreState {
  updateClient: (id: string, updates: Partial<Client>) => void;
  addAction: (action: ActionItem) => void;
  toggleActionDone: (actionId: string) => void;
  getClientById: (id: string) => Client | undefined;
  getActionsByClientId: (clientId: string) => ActionItem[];
  getActionsForDate: (dateISO: string) => ActionItem[];
  getPendingActionsForDate: (dateISO: string) => ActionItem[];
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, {
    clients: [],
    actions: [],
    isHydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const clientsJSON = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const actionsJSON = localStorage.getItem(STORAGE_KEYS.ACTIONS);

    if (clientsJSON && actionsJSON) {
      try {
        const clients = JSON.parse(clientsJSON);
        const actions = JSON.parse(actionsJSON);
        dispatch({ type: 'HYDRATE', payload: { clients, actions } });
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Fall back to seed data
        dispatch({ type: 'HYDRATE', payload: { clients: seedClients, actions: seedActions } });
      }
    } else {
      // First load: use seed data
      dispatch({ type: 'HYDRATE', payload: { clients: seedClients, actions: seedActions } });
    }
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (state.isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));
        localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(state.actions));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [state.clients, state.actions, state.isHydrated]);

  // Actions
  const updateClient = (id: string, updates: Partial<Client>) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: { id, updates } });
  };

  const addAction = (action: ActionItem) => {
    dispatch({ type: 'ADD_ACTION', payload: action });
  };

  const toggleActionDone = (actionId: string) => {
    dispatch({ type: 'TOGGLE_ACTION_DONE', payload: actionId });
  };

  const getClientById = (id: string): Client | undefined => {
    return state.clients.find((client) => client.id === id);
  };

  const getActionsByClientId = (clientId: string): ActionItem[] => {
    return state.actions
      .filter((action) => action.clientId === clientId)
      .sort((a, b) => {
        // Sort by createdAt descending (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const getActionsForDate = (dateISO: string): ActionItem[] => {
    return state.actions
      .filter((action) => action.dueDate === dateISO)
      .sort((a, b) => {
        // Sort by time if available, otherwise by creation date
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        if (a.dueTime) return -1;
        if (b.dueTime) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  };

  const getPendingActionsForDate = (dateISO: string): ActionItem[] => {
    return getActionsForDate(dateISO).filter((action) => !action.done);
  };

  const value: StoreContextValue = {
    ...state,
    updateClient,
    addAction,
    toggleActionDone,
    getClientById,
    getActionsByClientId,
    getActionsForDate,
    getPendingActionsForDate,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Hook
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
