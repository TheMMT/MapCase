"use client"

import { Box, Button, Container, Heading, HStack } from "@chakra-ui/react"
import Link from "next/link"

export default function Home() {
  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>MapCase</Heading>
      <HStack spacing={4}>
        <Link href="/locations/add" passHref>
          <Button colorScheme="blue">Konum Ekle</Button>
        </Link>
        <Link href="/locations" passHref>
          <Button colorScheme="green">Konumları Listele</Button>
        </Link>
      </HStack>
    </Container>
  )
}
