import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('@chakra-ui/react', () => {
  const actualChakra = jest.requireActual('@chakra-ui/react');
  return {
    ...actualChakra,
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ children, colorScheme }: { children: React.ReactNode; colorScheme: string }) => (
      <button data-color={colorScheme}>{children}</button>
    ),
  };
});

describe('Home Page', () => {
  test('renders heading', () => {
    render(<Home />);
    expect(screen.getByText('MapCase')).toBeInTheDocument();
  });

  test('renders "Konum Ekle" button', () => {
    render(<Home />);
    expect(screen.getByText('Konum Ekle')).toBeInTheDocument();
  });

  test('renders "Konumları Listele" button', () => {
    render(<Home />);
    expect(screen.getByText('Konumları Listele')).toBeInTheDocument();
  });

  test('link to add location has correct href', () => {
    render(<Home />);
    const addButton = screen.getByText('Konum Ekle');
    expect(addButton.closest('a')).toHaveAttribute('href', '/locations/add');
  });

  test('link to list locations has correct href', () => {
    render(<Home />);
    const listButton = screen.getByText('Konumları Listele');
    expect(listButton.closest('a')).toHaveAttribute('href', '/locations');
  });
}); 