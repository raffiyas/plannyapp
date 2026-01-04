'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Client, ActionItem, Stage, Potential } from '@/types';
import { clients as seedClients, actions as seedActions } from '@/data/seed';
import { todayISO, formatDateLabel } from './date';

// Storage keys
const STORAGE_KEYS = {
  CLIENTS: 'planny_clients',
  ACTIONS: 'planny_actions',
  BOARD_ORDER: 'planny_board_order',
};

// State interface
interface StoreState {
  clients: Client[];
  actions: ActionItem[];
  boardOrder: Record<Stage, string[]>;
  isHydrated: boolean;
}

// Action types
type StoreAction =
  | { type: 'HYDRATE'; payload: { clients: Client[]; actions: ActionItem[]; boardOrder: Record<Stage, string[]> } }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; updates: Partial<Client> } }
  | { type: 'ADD_ACTION'; payload: ActionItem }
  | { type: 'TOGGLE_ACTION_DONE'; payload: string }
  | { type: 'UPDATE_ACTION'; payload: { id: string; updates: Partial<ActionItem> } }
  | { type: 'UPDATE_BOARD_ORDER'; payload: Record<Stage, string[]> };

// Reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        clients: action.payload.clients,
        actions: action.payload.actions,
        boardOrder: action.payload.boardOrder,
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

    case 'UPDATE_BOARD_ORDER':
      return {
        ...state,
        boardOrder: action.payload,
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
  updateBoardOrder: (boardOrder: Record<Stage, string[]>) => void;
  getClientById: (id: string) => Client | undefined;
  getActionsByClientId: (clientId: string) => ActionItem[];
  getActionsForDate: (dateISO: string) => ActionItem[];
  getPendingActionsForDate: (dateISO: string) => ActionItem[];
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// Helper function to initialize board order from clients
function initializeBoardOrder(clients: Client[]): Record<Stage, string[]> {
  const order: Record<Stage, string[]> = {
    'prospectos': [],
    'contactados': [],
    'visita-agendada': [],
    'visitado': [],
    'cotizacion-enviada': [],
    'cerrado': [],
    'seguimiento': [],
  };

  clients.forEach(client => {
    order[client.stage].push(client.id);
  });

  return order;
}

// Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, {
    clients: [],
    actions: [],
    boardOrder: {
      'prospectos': [],
      'contactados': [],
      'visita-agendada': [],
      'visitado': [],
      'cotizacion-enviada': [],
      'cerrado': [],
      'seguimiento': [],
    },
    isHydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const clientsJSON = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    const actionsJSON = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    const boardOrderJSON = localStorage.getItem(STORAGE_KEYS.BOARD_ORDER);

    if (clientsJSON && actionsJSON) {
      try {
        const clients = JSON.parse(clientsJSON);
        const actions = JSON.parse(actionsJSON);

        // Load or initialize board order
        let boardOrder: Record<Stage, string[]>;
        if (boardOrderJSON) {
          boardOrder = JSON.parse(boardOrderJSON);
        } else {
          // Initialize from current clients
          boardOrder = initializeBoardOrder(clients);
        }

        dispatch({ type: 'HYDRATE', payload: { clients, actions, boardOrder } });
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Fall back to seed data
        const boardOrder = initializeBoardOrder(seedClients);
        dispatch({ type: 'HYDRATE', payload: { clients: seedClients, actions: seedActions, boardOrder } });
      }
    } else {
      // First load: use seed data
      const boardOrder = initializeBoardOrder(seedClients);
      dispatch({ type: 'HYDRATE', payload: { clients: seedClients, actions: seedActions, boardOrder } });
    }
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (state.isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(state.clients));
        localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(state.actions));
        localStorage.setItem(STORAGE_KEYS.BOARD_ORDER, JSON.stringify(state.boardOrder));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [state.clients, state.actions, state.boardOrder, state.isHydrated]);

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

  const updateBoardOrder = (boardOrder: Record<Stage, string[]>) => {
    dispatch({ type: 'UPDATE_BOARD_ORDER', payload: boardOrder });
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
    updateBoardOrder,
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
