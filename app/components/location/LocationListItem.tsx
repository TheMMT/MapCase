import { 
  Box, 
  Text, 
  HStack, 
  IconButton,
  Flex,
  Collapse
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChevronRightIcon } from '@/app/components/icons/ChevronRightIcon'
import { LocationMarker } from '@/app/components/location/LocationMarker'
import { Location } from '@/store/useStore'

interface LocationListItemProps {
  location: Location;
  onEdit: (id: string) => void;
}

export function LocationListItem({ location, onEdit }: LocationListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="md" 
      p={3}
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4} flex="1" onClick={() => setIsExpanded(!isExpanded)} cursor="pointer">
          <LocationMarker color={location.color} />
          <Text fontWeight="bold">{location.name}</Text>
        </HStack>

        <IconButton
          icon={<ChevronRightIcon />}
          aria-label="Konumu düzenle"
          variant="ghost"
          onClick={() => onEdit(location.id)}
        />
      </Flex>

      <Collapse in={isExpanded} animateOpacity>
        <Box pl={10} pt={3}>
          <Text>Enlem: {location.lat.toFixed(6)}</Text>
          <Text>Boylam: {location.lng.toFixed(6)}</Text>
        </Box>
      </Collapse>
    </Box>
  );
} 