import L from 'leaflet'
import { ExtendedLocation } from '@/app/types/location'

export const createCustomIcon = (color: string | undefined) => {
  if (!color) color = '#FF5733'; 
  
  return new L.Icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: `custom-icon-${color.slice(1)}`,
  });
};

export const polylineOptions = {
  color: '#3388ff',
  weight: 4,
  opacity: 0.7,
  smoothFactor: 1
};

export const userCircleStyle = {
  color: '#4285F4',
  fillColor: '#4285F4',
  fillOpacity: 0.5,
  weight: 2
};

export const getFullRoute = (
  locations: ExtendedLocation[], 
  userLocation: { lat: number; lng: number } | null
) => {
  const routePoints = locations.map(loc => [loc.lat, loc.lng] as [number, number]);
  
  if (!userLocation || locations.length === 0) return routePoints;
  
  return [[userLocation.lat, userLocation.lng], ...routePoints] as [number, number][];
}; 