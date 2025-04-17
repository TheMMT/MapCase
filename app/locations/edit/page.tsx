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
  VStack,
  Text,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/app/components/Map'), { 
  ssr: false,
  loading: () => <Box h="400px" w="100%" bg="gray.100" borderRadius="md" />
})

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

export default function EditLocation({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [name, setName] = useState('')
  const [position, setPosition] = useState({ lat: 41.015137, lng: 28.979530 }) 
  const [color, setColor] = useState('#3388ff') 
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      const locationToEdit = savedLocations.find((loc: Location) => loc.id === parseInt(params.id))
      
      if (locationToEdit) {
        setLocation(locationToEdit)
        setName(locationToEdit.name)
        setPosition({ lat: locationToEdit.lat, lng: locationToEdit.lng })
        setColor(locationToEdit.color)
      } else {
        toast({
          title: 'Konum bulunamadı',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        router.push('/locations')
      }
    }
  }, [params.id, router, toast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: 'Konum adı gereklidir',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    
    if (typeof window !== 'undefined' && location) {
      const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      const updatedLocations = savedLocations.map((loc: Location) => {
        if (loc.id === location.id) {
          return {
            ...loc,
            name,
            lat: position.lat,
            lng: position.lng,
            color
          }
        }
        return loc
      })
      
      localStorage.setItem('locations', JSON.stringify(updatedLocations))
      
      toast({
        title: 'Konum güncellendi',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      router.push('/locations')
    }
  }

  const handleDelete = () => {
    if (typeof window !== 'undefined' && location) {
      const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      const filteredLocations = savedLocations.filter((loc: Location) => loc.id !== location.id)
      
      localStorage.setItem('locations', JSON.stringify(filteredLocations))
      
      toast({
        title: 'Konum silindi',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      
      router.push('/locations')
    }
  }

  if (!location) {
    return (
      <Container maxW="container.md" py={5}>
        <Text>Yükleniyor...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={5}>
      <Heading mb={5}>Konumu Düzenle</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Konum Adı</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Konum adını girin"
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Marker Rengi</FormLabel>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Haritadan konum seçin</FormLabel>
            <Box h="400px" w="100%" borderRadius="md" overflow="hidden">
              <Map 
                position={position} 
                setPosition={setPosition} 
                markerColor={color}
              />
            </Box>
            <Text fontSize="sm" mt={2}>
              Enlem: {position.lat.toFixed(6)}, Boylam: {position.lng.toFixed(6)}
            </Text>
          </FormControl>
          
          <Box display="flex" justifyContent="space-between" pt={4}>
            <Button colorScheme="red" onClick={handleDelete}>
              Konumu Sil
            </Button>
            <Box>
              <Button mr={3} onClick={() => router.push('/locations')}>
                İptal
              </Button>
              <Button colorScheme="blue" type="submit">
                Kaydet
              </Button>
            </Box>
          </Box>
        </VStack>
      </form>
    </Container>
  )
} 