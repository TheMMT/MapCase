import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationsList from '../app/locations/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@chakra-ui/react', () => {
  const ActualChakra = jest.requireActual('@chakra-ui/react');
  return {
    ...ActualChakra,
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    List: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
    ListItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
    HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    IconButton: (props: any) => <button {...props}>{props.children}</button>,
    Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
      <button onClick={onClick}>{children}</button>
    ),
    Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Collapse: ({ children, in: isOpen }: { children: React.ReactNode; in: boolean }) => (
      isOpen ? <div>{children}</div> : null
    ),
  };
});

jest.mock('../store/useStore', () => ({
  useLocationStore: (selector: any) => {
    const mockState = {
      locations: []
    };
    return selector ? selector(mockState) : mockState;
  }
}));

describe('LocationsList Page', () => {
  let mockedUseLocationStore: jest.SpyInstance;

  beforeEach(() => {
    mockedUseLocationStore = jest.spyOn(require('../store/useStore'), 'useLocationStore');
  });

  afterEach(() => {
    mockedUseLocationStore.mockRestore();
  });

  test('renders empty state message when no locations exist', () => {
    mockedUseLocationStore.mockImplementation((selector) => {
      const mockState = { locations: [] };
      return selector(mockState);
    });
    
    render(<LocationsList />);
    
    expect(screen.getByText('Henüz kaydedilmiş konum bulunmamaktadır.')).toBeInTheDocument();
  });

  test('renders location items when locations exist', () => {
    const mockLocations = [
      {
        id: '1',
        name: 'İstanbul',
        lat: 41.0082,
        lng: 28.9784,
        color: '#FF0000'
      },
      {
        id: '2',
        name: 'Ankara',
        lat: 39.9334,
        lng: 32.8597,
        color: '#00FF00'
      }
    ];
    
    mockedUseLocationStore.mockImplementation((selector) => {
      const mockState = { locations: mockLocations };
      return selector(mockState);
    });
    
    render(<LocationsList />);
    
    expect(screen.getByText('İstanbul')).toBeInTheDocument();
    expect(screen.getByText('Ankara')).toBeInTheDocument();
  });

  test('renders "Rota Göster" button', () => {
    mockedUseLocationStore.mockImplementation((selector) => {
      const mockState = { locations: [] };
      return selector(mockState);
    });
    
    render(<LocationsList />);
    
    expect(screen.getByText('Rota Göster')).toBeInTheDocument();
  });
}); 