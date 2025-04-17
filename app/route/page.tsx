"use client"

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  HStack,
  List,
  ListItem,
  Flex,
  Checkbox,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useLocationStore, Location as LocationType } from '@/store/useStore'

const ArrowBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RouteMap = dynamic(() => import('./RouteMap'), { 
  ssr: false,
  loading: () => (
    <Box h={{ base: "300px", md: "500px" }} w="100%" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
    </Box>
  )
})


interface ExtendedLocation extends LocationType {
  isSelected?: boolean;
  distance?: number;
}

export default function RoutePage() {
  const storeLocations = useLocationStore(state => state.locations)
  const [locations, setLocations] = useState<ExtendedLocation[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingUserLocation, setIsLoadingUserLocation] = useState(false)
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    setLocations(storeLocations.map(loc => ({ ...loc, isSelected: true })))
    
    getUserLocation()
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'))
    }

    const timeoutId = setTimeout(handleResize, 1000)

    return () => clearTimeout(timeoutId)
  }, [storeLocations])

  const getUserLocation = () => {
    setIsLoadingUserLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLoadingUserLocation(false)
        },
        (error) => {
          console.error('Konum alınamadı:', error)
          toast({
            title: 'Konum izni reddedildi',
            description: 'Mevcut konumunuza göre rota oluşturulamayacak',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
          setIsLoadingUserLocation(false)
        }
      )
    } else {
      toast({
        title: 'Tarayıcınız konum hizmetini desteklemiyor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsLoadingUserLocation(false)
    }
  }

  const toggleLocationSelection = (id: string) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, isSelected: !loc.isSelected } : loc
    ))
  }

  const selectAllLocations = () => {
    setLocations(locations.map(loc => ({ ...loc, isSelected: true })))
  }

  const deselectAllLocations = () => {
    setLocations(locations.map(loc => ({ ...loc, isSelected: false })))
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  const toRad = (value: number) => {
    return value * Math.PI / 180
  }

  const getOptimizedRoute = (): ExtendedLocation[] => {
    const selectedLocations = locations.filter(loc => loc.isSelected)
    
    if (!userLocation || selectedLocations.length === 0) {
      return selectedLocations
    }
    
    const locationsWithDistance = selectedLocations.map(loc => ({
      ...loc,
      distance: calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        loc.lat, 
        loc.lng
      )
    }))
    
    return locationsWithDistance.sort((a, b) => 
      (a.distance || 0) - (b.distance || 0)
    )
  }

  const selectedLocationsCount = locations.filter(loc => loc.isSelected).length

  return (
    <Container maxW="container.xl" py={5}>
      <HStack mb={5}>
        <Button 
          leftIcon={<ArrowBackIcon />} 
          variant="ghost" 
          onClick={() => router.push('/locations')}
        >
          Geri
        </Button>
        <Heading>Rota Görünümü</Heading>
      </HStack>
      
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={5}
      >
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
        
        <Box 
          flex="1" 
          height={{ base: "300px", md: "500px" }} 
          borderWidth="1px" 
          borderRadius="md" 
          overflow="hidden"
          position="relative"
        >
          <RouteMap 
            locations={getOptimizedRoute()} 
            userLocation={userLocation}
            isLoadingUserLocation={isLoadingUserLocation}
          />
        </Box>
      </Flex>
    </Container>
  )
}

function getHueRotate(hexColor: string | undefined): number {
  if (!hexColor) return 0;
  
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