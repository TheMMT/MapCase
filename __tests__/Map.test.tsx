import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Map from '../app/components/Map';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer"></div>,
  Marker: () => <div data-testid="marker"></div>,
  useMapEvents: jest.fn(),
}));

jest.mock('leaflet', () => ({
  Icon: jest.fn().mockImplementation(() => ({})),
}));

describe('Map Component', () => {
  const mockPosition = { lat: 41.0082, lng: 28.9784 };
  const mockSetPosition = jest.fn();
  const mockMarkerColor = '#FF0000';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders map container', () => {
    render(
      <Map
        position={mockPosition}
        setPosition={mockSetPosition}
        markerColor={mockMarkerColor}
      />
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('renders tile layer', () => {
    render(
      <Map
        position={mockPosition}
        setPosition={mockSetPosition}
        markerColor={mockMarkerColor}
      />
    );

    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  test('renders marker', () => {
    render(
      <Map
        position={mockPosition}
        setPosition={mockSetPosition}
        markerColor={mockMarkerColor}
      />
    );

    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });
}); 