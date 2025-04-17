"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  color: string;
}

interface RouteMapProps {
  locations: Location[];
}

export default function RouteMap({ locations }: RouteMapProps) {
  const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]))
  
  const center = bounds.getCenter()
  
  const routePositions = locations.map(loc => [loc.lat, loc.lng] as [number, number])
  
  useEffect(() => {
    locations.forEach((location, index) => {
      const style = document.createElement('style')
      style.innerHTML = `
        .marker-icon-${index} {
          filter: hue-rotate(${getHueRotate(location.color)}deg) saturate(2);
        }
      `
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    })
  }, [locations])

  return (
    <MapContainer 
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map((location, index) => {
        const customIcon = new L.Icon({
          iconUrl: '/marker-icon.png',
          iconRetinaUrl: '/marker-icon-2x.png',
          shadowUrl: '/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          className: `marker-icon-${index}`,
        })
        
        return (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]} 
            icon={customIcon}
          >
          </Marker>
        )
      })}
      
      <Polyline positions={routePositions} color="blue" weight={3} opacity={0.7} />
    </MapContainer>
  )
}

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