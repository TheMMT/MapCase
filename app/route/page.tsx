"use client"

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

const RouteMapWithNoSSR = dynamic<{locations: Location[]}>(() => import('./RouteMap'), {
  ssr: false,
}) as any 

export default function RoutePage() {
  const [locations, setLocations] = useState<Location[]>([])
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      setLocations(savedLocations)
    }
  }, [])

  const handleGoBack = () => {
    router.push('/locations')
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Rota Görünümü</Heading>
      
      {locations.length < 2 ? (
        <VStack spacing={4} align="stretch">
          <Text>Rota oluşturmak için en az 2 konum gereklidir.</Text>
          <Button onClick={handleGoBack}>Geri Dön</Button>
        </VStack>
      ) : (
        <>
          <Box 
            position="relative" 
            h={{ base: "300px", md: "400px", lg: "500px" }}
            mb={5}
            borderRadius="md"
            overflow="hidden"
          >
            <RouteMapWithNoSSR locations={locations} />
          </Box>
          
          <Button onClick={handleGoBack} mt={3}>
            Geri Dön
          </Button>
        </>
      )}
    </Container>
  )
} 