import { Marker, Popup } from 'react-leaflet'
import { Box, Text } from '@chakra-ui/react'
import { ExtendedLocation } from '@/app/types/location'
import { createCustomIcon } from '@/app/utils/mapUtils'

interface LocationMarkersProps {
  locations: ExtendedLocation[];
}

export function LocationMarkers({ locations }: LocationMarkersProps) {
  return (
    <>
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
    </>
  );
} 