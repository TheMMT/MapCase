"use client"

import { useEffect, useRef } from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ExtendedLocation } from '@/app/types/location'
import { MapUpdater } from '@/app/components/map-modules/MapUpdater'
import { UserLocationMarker } from '@/app/components/map-modules/UserLocationMarker'
import { LocationMarkers } from '@/app/components/map-modules/LocationMarkers'
import { getFullRoute, polylineOptions } from '@/app/utils/mapUtils'
import { getHueRotate } from '@/app/utils/colorUtils'

interface RouteMapProps {
  locations: ExtendedLocation[];
  userLocation: { lat: number; lng: number } | null;
  isLoadingUserLocation: boolean;
}

export default function RouteMap({ locations, userLocation, isLoadingUserLocation }: RouteMapProps) {
  const defaultCenter = { lat: 41.015137, lng: 28.979530 };
  const mapRef = useRef<L.Map | null>(null);
  
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
        
        {userLocation && <UserLocationMarker userLocation={userLocation} />}
        
        <LocationMarkers locations={locations} />
        
        {locations.length > 0 && (
          <Polyline positions={getFullRoute(locations, userLocation)} {...polylineOptions} />
        )}
        
        <MapUpdater 
          locations={locations} 
          userLocation={userLocation}
        />
      </MapContainer>
    </Box>
  )
} 