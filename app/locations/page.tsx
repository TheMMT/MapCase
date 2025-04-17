"use client"

import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  List, 
  Text, 
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useLocationStore } from '@/store/useStore'
import { MapIcon } from '@/app/components/icons/MapIcon'
import { LocationListItem } from '@/app/components/location/LocationListItem'

export default function LocationsList() {
  const locations = useLocationStore(state => state.locations)
  const router = useRouter()

  const handleEditLocation = (id: string) => {
    router.push(`/locations/edit/${id}`)
  }

  const handleShowRoute = () => {
    router.push('/route')
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Kaydedilmiş Konumlar</Heading>
      
      <Button 
        colorScheme="blue" 
        mb={5} 
        leftIcon={<MapIcon />}
        onClick={handleShowRoute}
      >
        Rota Göster
      </Button>

      <List spacing={3}>
        {locations.length === 0 ? (
          <Text>Henüz kaydedilmiş konum bulunmamaktadır.</Text>
        ) : (
          locations.map((location) => (
            <LocationListItem 
              key={location.id}
              location={location}
              onEdit={handleEditLocation}
            />
          ))
        )}
      </List>
    </Container>
  )
} 