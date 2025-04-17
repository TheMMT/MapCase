import { Circle, Marker, Popup } from 'react-leaflet'
import { Text } from '@chakra-ui/react'
import L from 'leaflet'
import { userCircleStyle } from '@/app/utils/mapUtils'

interface UserLocationMarkerProps {
  userLocation: { lat: number; lng: number };
}

export function UserLocationMarker({ userLocation }: UserLocationMarkerProps) {
  return (
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
  );
} 