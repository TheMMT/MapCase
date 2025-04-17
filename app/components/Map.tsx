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
  // Özel renkli marker oluştur
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
    // CSS ile marker rengini değiştir
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

// RGB renk değerini hue rotate değerine dönüştür
function getHueRotate(hexColor: string): number {
  // Basit bir dönüşüm - gerçek projede daha karmaşık bir hesaplama gerekebilir
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  return Math.floor((r + g + b) / 3) % 360
} 