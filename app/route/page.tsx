"use client"

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Flex,
  Spinner
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useLocationStore } from '@/store/useStore'
import { ExtendedLocation } from '@/app/types/location'
import { useLocationUtils } from '@/app/hooks/useLocationUtils'
import { ArrowBackIcon } from '@/app/components/icons/ArrowBackIcon'
import LocationsList from '@/app/components/route/LocationsList'

const RouteMap = dynamic(() => import('./RouteMap'), { 
  ssr: false,
  loading: () => (
    <Box h={{ base: "300px", md: "500px" }} w="100%" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.500" thickness="4px" />
    </Box>
  )
})

export default function RoutePage() {
  const storeLocations = useLocationStore(state => state.locations)
  const [locations, setLocations] = useState<ExtendedLocation[]>([])
  const { userLocation, isLoadingUserLocation, getUserLocation, getOptimizedRoute } = useLocationUtils()
  const router = useRouter()

  useEffect(() => {
    setLocations(storeLocations.map(loc => ({ ...loc, isSelected: true })))
    
    getUserLocation()
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'))
    }

    const timeoutId = setTimeout(handleResize, 1000)

    return () => clearTimeout(timeoutId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeLocations])

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

  return (
    <Container maxW="container.xl" py={5}>
      <Flex alignItems="center" mb={5}>
        <Button 
          leftIcon={<ArrowBackIcon />} 
          variant="ghost" 
          onClick={() => router.push('/locations')}
        >
          Geri
        </Button>
        <Heading>Rota Görünümü</Heading>
      </Flex>
      
      <Flex 
        direction={{ base: "column", md: "row" }} 
        gap={5}
      >
        <LocationsList 
          locations={locations}
          toggleLocationSelection={toggleLocationSelection}
          selectAllLocations={selectAllLocations}
          deselectAllLocations={deselectAllLocations}
        />
        
        <Box 
          flex="1" 
          height={{ base: "300px", md: "500px" }} 
          borderWidth="1px" 
          borderRadius="md" 
          overflow="hidden"
          position="relative"
        >
          <RouteMap 
            locations={getOptimizedRoute(locations)} 
            userLocation={userLocation}
            isLoadingUserLocation={isLoadingUserLocation}
          />
        </Box>
      </Flex>
    </Container>
  )
} 