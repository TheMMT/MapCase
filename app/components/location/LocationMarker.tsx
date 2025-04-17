import { Box } from '@chakra-ui/react'
import Image from 'next/image'
import { getHueRotate } from '@/app/utils/colorUtils'

interface LocationMarkerProps {
  color?: string;
  width?: number;
  height?: number;
}

export function LocationMarker({ 
  color, 
  width = 25, 
  height = 41 
}: LocationMarkerProps) {
  return (
    <Box position="relative" width={`${width}px`} height={`${height}px`}>
      <div 
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
          filter: `hue-rotate(${getHueRotate(color)}deg) saturate(2)`
        }}
      >
        <Image 
          src="/marker-icon.png" 
          alt="Konum İşareti" 
          width={width} 
          height={height}
        />
      </div>
    </Box>
  );
} 