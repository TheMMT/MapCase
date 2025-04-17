"use client"

import { useEffect } from 'react'
import { 
  Container, 
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function EditLocation() {
  const router = useRouter()

  useEffect(() => {
    router.push('/locations')
  }, [router])

  return (
    <Container maxW="container.md" py={5}>
      <Text>Yönlendiriliyor...</Text>
    </Container>
  )
} 