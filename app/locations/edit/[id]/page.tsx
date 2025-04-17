"use client"

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Text, 
  VStack,
  useToast
} from '@chakra-ui/react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

const MapWithNoSSR = dynamic(() => import('../../../components/Map'), {
  ssr: false,
})

export default function EditLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [locationName, setLocationName] = useState('')
  const [position, setPosition] = useState({ lat: 0, lng: 0 })
  const [markerColor, setMarkerColor] = useState('#FF5733')
  
  const toast = useToast()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const locations = JSON.parse(localStorage.getItem('locations') || '[]')
      const foundLocation = locations.find((loc: Location) => loc.id === parseInt(id))
      
      if (foundLocation) {
        setLocation(foundLocation)
        setLocationName(foundLocation.name)
        setPosition({ lat: foundLocation.lat, lng: foundLocation.lng })
        setMarkerColor(foundLocation.color)
      } else {
        toast({
          title: 'Hata',
          description: 'Konum bulunamadı',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        router.push('/locations')
      }
    }
  }, [id, router, toast])

  const handleUpdateLocation = () => {
    if (!locationName) {
      toast({
        title: 'Hata',
        description: 'Lütfen konum adı giriniz',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const locations = JSON.parse(localStorage.getItem('locations') || '[]')
    const updatedLocations = locations.map((loc: Location) => {
      if (loc.id === parseInt(id)) {
        return {
          ...loc,
          name: locationName,
          lat: position.lat,
          lng: position.lng,
          color: markerColor
        }
      }
      return loc
    })
    
    localStorage.setItem('locations', JSON.stringify(updatedLocations))
    
    toast({
      title: 'Başarılı',
      description: 'Konum başarıyla güncellendi',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    
    router.push('/locations')
  }

  const handleDeleteLocation = () => {
    const locations = JSON.parse(localStorage.getItem('locations') || '[]')
    const filteredLocations = locations.filter((loc: Location) => loc.id !== parseInt(id))
    
    localStorage.setItem('locations', JSON.stringify(filteredLocations))
    
    toast({
      title: 'Başarılı',
      description: 'Konum başarıyla silindi',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    
    router.push('/locations')
  }

  if (!location) {
    return (
      <Container maxW="container.xl" py={5}>
        <Text>Yükleniyor...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Konum Düzenle</Heading>
      
      <Box 
        position="relative" 
        h={{ base: "300px", md: "400px", lg: "500px" }}
        mb={5}
        borderRadius="md"
        overflow="hidden"
      >
        <MapWithNoSSR position={position} setPosition={setPosition} markerColor={markerColor} />
      </Box>
      
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Konum Adı</FormLabel>
          <Input 
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Konum adını giriniz"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>İşaretçi Rengi</FormLabel>
          <Input 
            type="color" 
            value={markerColor}
            onChange={(e) => setMarkerColor(e.target.value)}
            w="100px"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Konum Bilgileri</FormLabel>
          <Text>Enlem: {position.lat.toFixed(6)}</Text>
          <Text>Boylam: {position.lng.toFixed(6)}</Text>
        </FormControl>
        
        <Box display="flex" justifyContent="space-between">
          <Button colorScheme="blue" onClick={handleUpdateLocation}>
            Güncelle
          </Button>
          
          <Button colorScheme="red" onClick={handleDeleteLocation}>
            Sil
          </Button>
        </Box>
      </VStack>
    </Container>
  )
} 