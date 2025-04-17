"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

interface MapProps {
  position: {
    lat: number;
    lng: number;
  };
  setPosition: (position: { lat: number; lng: number }) => void;
  markerColor: string;
}

function MapClickHandler({ setPosition }: { setPosition: (position: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e: { latlng: { lat: number; lng: number } }) => {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function Map({ position, setPosition, markerColor }: MapProps) {
  const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'custom-icon',
  })

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .custom-icon {
        filter: hue-rotate(${getHueRotate(markerColor)}deg) saturate(2);
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [markerColor])

  return (
    <MapContainer 
      center={[position.lat, position.lng]} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat, position.lng]} icon={customIcon} />
      <MapClickHandler setPosition={setPosition} />
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