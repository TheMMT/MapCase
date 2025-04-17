import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { ExtendedLocation } from '@/app/types/location'

interface MapUpdaterProps { 
  locations: ExtendedLocation[];
  userLocation: { lat: number; lng: number } | null;
}

export function MapUpdater({ 
  locations, 
  userLocation 
}: MapUpdaterProps) {
  const map = useMap()
  
  useEffect(() => {
    if (locations.length === 0 && !userLocation) return;
    
    const bounds = new L.LatLngBounds([]);
    
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }
    
    locations.forEach(location => {
      bounds.extend([location.lat, location.lng]);
    });
    
    if (bounds.getNorthEast().lat !== bounds.getSouthWest().lat || 
        bounds.getNorthEast().lng !== bounds.getSouthWest().lng) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations, userLocation, map]);
  
  return null;
} 