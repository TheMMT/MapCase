import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ExtendedLocation } from '@/app/types/location'
import { calculateDistance } from '@/app/utils/routeUtils'

export const useLocationUtils = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingUserLocation, setIsLoadingUserLocation] = useState(false)
  const toast = useToast()

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

  const getOptimizedRoute = (locations: ExtendedLocation[]): ExtendedLocation[] => {
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

  return {
    userLocation,
    isLoadingUserLocation,
    getUserLocation,
    getOptimizedRoute
  }
} 