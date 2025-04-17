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
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { useLocationStore } from '@/store/useStore'

const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
})

export default function AddLocation() {
  const [position, setPosition] = useState({ lat: 41.015137, lng: 28.979530 })
  const [locationName, setLocationName] = useState('')
  const [markerColor, setMarkerColor] = useState('#FF5733')
  const addLocation = useLocationStore(state => state.addLocation)
  const toast = useToast()

  useEffect(() => {
    // Leaflet konfigürasyonu client tarafında yapılmalı
    import('leaflet').then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      })
    })
  }, [])

  const handleSaveLocation = () => {
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

    const newLocation = {
      id: Date.now().toString(),
      name: locationName,
      lat: position.lat,
      lng: position.lng,
      color: markerColor
    }
    
    addLocation(newLocation)
    
    toast({
      title: 'Başarılı',
      description: 'Konum başarıyla kaydedildi',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    
    setLocationName('')
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Konum Ekle</Heading>
      
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
        
        <Button colorScheme="blue" onClick={handleSaveLocation}>
          Konumu Kaydet
        </Button>
      </VStack>
    </Container>
  )
} 