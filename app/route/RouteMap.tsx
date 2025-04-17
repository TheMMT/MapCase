"use client"

import { useEffect, useRef } from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Location as LocationType } from '@/store/useStore'

interface ExtendedLocation extends LocationType {
  isSelected?: boolean;
  distance?: number;
}

interface RouteMapProps {
  locations: ExtendedLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoadingUserLocation: boolean;
}

function MapUpdater({ 
  locations, 
  userLocation 
}: { 
  locations: ExtendedLocation[];
  userLocation: { lat: number; lng: number } | null;
}) {
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

export default function RouteMap({ locations, userLocation, isLoadingUserLocation }: RouteMapProps) {
  const defaultCenter = { lat: 41.015137, lng: 28.979530 };
  const mapRef = useRef<L.Map | null>(null);
  
  const userCircleStyle = {
    color: '#4285F4',
    fillColor: '#4285F4',
    fillOpacity: 0.5,
    weight: 2
  };
  
  const polylineOptions = {
    color: '#3388ff',
    weight: 4,
    opacity: 0.7,
    smoothFactor: 1
  };
  
  const createCustomIcon = (color: string | undefined) => {
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
  
  useEffect(() => {
    const style = document.createElement('style');
    let styleRules = '';
    
    locations.forEach(location => {
      if (!location.color) return;
      
      const hueRotate = getHueRotate(location.color);
      styleRules += `
        .custom-icon-${location.color.slice(1)} {
          filter: hue-rotate(${hueRotate}deg) saturate(2);
        }
      `;
    });
    
    style.innerHTML = styleRules;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [locations]);
  
  useEffect(() => {
    if (mapRef.current) {
      const handleResize = () => {
        mapRef.current?.invalidateSize();
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);
      
      const timeoutId = setTimeout(() => {
        handleResize();
      }, 500);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
      };
    }
  }, []);
  
  const routePoints = locations.map(loc => [loc.lat, loc.lng] as [number, number]);
  
  const getFullRoute = () => {
    if (!userLocation || locations.length === 0) return routePoints;
    
    return [[userLocation.lat, userLocation.lng], ...routePoints] as [number, number][];
  };
  
  return (
    <Box position="relative" height="100%" width="100%">
      {isLoadingUserLocation && (
        <Box 
          position="absolute" 
          top={4} 
          right={4} 
          zIndex={1000} 
          bg="white" 
          p={2} 
          borderRadius="md"
          boxShadow="md"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Spinner size="sm" />
          <Text fontSize="sm">Konumunuz alınıyor...</Text>
        </Box>
      )}
      
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={13} 
        style={{ height: '500px', width: '100%', zIndex: 1 }}
        ref={mapRef}
        whenReady={() => {
          if (mapRef.current) {
            setTimeout(() => {
              mapRef.current?.invalidateSize();
            }, 0);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <>
            <Circle 
              center={[userLocation.lat, userLocation.lng]} 
              radius={50} 
              pathOptions={userCircleStyle}
            />
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={new L.DivIcon({
                html: '<div style="background-color: #4285F4; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                className: 'user-location-marker',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>
                <Text fontWeight="bold">Mevcut Konumunuz</Text>
              </Popup>
            </Marker>
          </>
        )}
        
        {locations.map((location) => (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]} 
            icon={createCustomIcon(location.color)}
          >
            <Popup>
              <Box>
                <Text fontWeight="bold">{location.name}</Text>
                <Text fontSize="sm">Enlem: {location.lat.toFixed(6)}</Text>
                <Text fontSize="sm">Boylam: {location.lng.toFixed(6)}</Text>
              </Box>
            </Popup>
          </Marker>
        ))}
        
        {locations.length > 0 && (
          <Polyline positions={getFullRoute()} {...polylineOptions} />
        )}
        
        <MapUpdater 
          locations={locations} 
          userLocation={userLocation}
        />
      </MapContainer>
    </Box>
  )
}

function getHueRotate(hexColor: string | undefined): number {
  if (!hexColor) return 0;
  
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  
  if (max !== min) {
    if (max === r) {
      h = 60 * ((g - b) / (max - min));
      if (g < b) h += 360;
    } else if (max === g) {
      h = 60 * ((b - r) / (max - min)) + 120;
    } else {
      h = 60 * ((r - g) / (max - min)) + 240;
    }
  }
  
  const blueMarkerHue = 240;
  
  return h - blueMarkerHue;
} 