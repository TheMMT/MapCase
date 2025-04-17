"use client"

import { Box, Button, Container, Heading } from "@chakra-ui/react"
import Link from "next/link"

export default function Home() {
  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>MapCase</Heading>
      <Box>
        <Link href="/locations/add" passHref>
          <Button colorScheme="blue">Konum Ekle</Button>
        </Link>
      </Box>
    </Container>
  )
}
