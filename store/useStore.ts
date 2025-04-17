import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  color?: string;
}

interface LocationState {
  locations: Location[];
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      locations: [],
      addLocation: (location: Location) => set((state) => ({ 
        locations: [...state.locations, location] 
      })),
      updateLocation: (location: Location) => set((state) => ({ 
        locations: state.locations.map((loc) => 
          loc.id === location.id ? location : loc
        ) 
      })),
      deleteLocation: (id: string) => set((state) => ({ 
        locations: state.locations.filter((loc) => loc.id !== id) 
      })),
    }),
    {
      name: 'locations-storage',
    }
  )
);
