import { GraphData } from './types';
import { seedData } from './seedData';

const STORAGE_KEY = 'skill-matrix-graph-data';

export const getGraphData = (): GraphData => {
  if (typeof window === 'undefined') return seedData;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : seedData;
  } catch (error) {
    console.error('Failed to load graph data from localStorage:', error);
    return seedData;
  }
};

export const saveGraphData = (data: GraphData): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save graph data to localStorage:', error);
    }
  }
};

const POSITIONS_KEY = 'skill-matrix-node-positions';

export interface NodePosition {
  x: number;
  y: number;
}

export const getNodePositions = (): Record<string, NodePosition> => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(POSITIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load node positions:', error);
    return {};
  }
};

export const saveNodePositions = (positions: Record<string, NodePosition>): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    } catch (error) {
      console.error('Failed to save node positions:', error);
    }
  }
};
