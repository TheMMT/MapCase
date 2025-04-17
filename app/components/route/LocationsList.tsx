import { 
  Box, 
  Text, 
  List, 
  ListItem, 
  Flex, 
  Checkbox, 
  Button, 
  HStack 
} from '@chakra-ui/react'
import Image from 'next/image'
import { ExtendedLocation } from '@/app/types/location'
import { getHueRotate } from '@/app/utils/colorUtils'

interface LocationsListProps {
  locations: ExtendedLocation[]
  toggleLocationSelection: (id: string) => void
  selectAllLocations: () => void
  deselectAllLocations: () => void
}

export default function LocationsList({ 
  locations, 
  toggleLocationSelection, 
  selectAllLocations, 
  deselectAllLocations 
}: LocationsListProps) {
  const selectedLocationsCount = locations.filter(loc => loc.isSelected).length

  return (
    <Box 
      width={{ base: "100%", md: "350px" }} 
      borderWidth="1px" 
      borderRadius="md" 
      p={4} 
      height={{ base: "auto", md: "500px" }}
      overflowY="auto"
    >
      <Text fontWeight="bold" mb={3}>
        Konumlar ({selectedLocationsCount}/{locations.length})
      </Text>
      
      <HStack spacing={4} mb={3}>
        <Button size="sm" onClick={selectAllLocations}>Tümünü Seç</Button>
        <Button size="sm" onClick={deselectAllLocations}>Tümünü Kaldır</Button>
      </HStack>
      
      {locations.length === 0 ? (
        <Text>Henüz kaydedilmiş konum bulunmamaktadır.</Text>
      ) : (
        <List spacing={2}>
          {locations.map((location) => (
            <ListItem 
              key={location.id} 
              borderWidth="1px" 
              borderRadius="md" 
              p={2}
            >
              <Flex align="center">
                <Checkbox 
                  isChecked={location.isSelected} 
                  onChange={() => toggleLocationSelection(location.id)}
                  mr={3}
                />
                <Box position="relative" width="20px" height="33px" mr={2}>
                  <div 
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '33px',
                      filter: `hue-rotate(${getHueRotate(location.color)}deg) saturate(2)`
                    }}
                  >
                    <Image 
                      src="/marker-icon.png" 
                      alt="Konum İşareti" 
                      width={20} 
                      height={33}
                    />
                  </div>
                </Box>
                <Text>{location.name}</Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
} 