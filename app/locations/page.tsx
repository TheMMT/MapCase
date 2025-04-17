"use client"

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  List, 
  ListItem, 
  HStack, 
  Text, 
  VStack,
  IconButton,
  Flex,
  Collapse
} from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

// Özel ikonlar
const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [expandedLocationId, setExpandedLocationId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Client tarafında çalıştığından emin ol
    if (typeof window !== 'undefined') {
      const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      setLocations(savedLocations)
    }
  }, [])

  const toggleLocationExpand = (id: number) => {
    if (expandedLocationId === id) {
      setExpandedLocationId(null)
    } else {
      setExpandedLocationId(id)
    }
  }

  const handleEditLocation = (id: number) => {
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
            <ListItem 
              key={location.id} 
              borderWidth="1px" 
              borderRadius="md" 
              p={3}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={4} flex="1" onClick={() => toggleLocationExpand(location.id)} cursor="pointer">
                  {/* Marker ikonu */}
                  <Box position="relative" width="25px" height="41px">
                    <div 
                      style={{
                        position: 'absolute',
                        width: '25px',
                        height: '41px',
                        filter: `hue-rotate(${getHueRotate(location.color)}deg) saturate(2)`
                      }}
                    >
                      <Image 
                        src="/marker-icon.png" 
                        alt="Konum İşareti" 
                        width={25} 
                        height={41}
                      />
                    </div>
                  </Box>
                  
                  <Text fontWeight="bold">{location.name}</Text>
                </HStack>

                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Konumu düzenle"
                  variant="ghost"
                  onClick={() => handleEditLocation(location.id)}
                />
              </Flex>

              <Collapse in={expandedLocationId === location.id} animateOpacity>
                <Box pl={10} pt={3}>
                  <Text>Enlem: {location.lat.toFixed(6)}</Text>
                  <Text>Boylam: {location.lng.toFixed(6)}</Text>
                </Box>
              </Collapse>
            </ListItem>
          ))
        )}
      </List>
    </Container>
  )
}

// Map.tsx'den alınan renk dönüşüm fonksiyonu
function getHueRotate(hexColor: string): number {
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