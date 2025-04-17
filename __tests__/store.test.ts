import { useLocationStore, Location } from '../store/useStore';

describe('useLocationStore', () => {
  beforeEach(() => {
    useLocationStore.setState({ locations: [] });
  });

  test('should add a location', () => {
    const newLocation: Location = {
      id: '1',
      name: 'Test Location',
      lat: 41.0082,
      lng: 28.9784,
      description: 'Test Description',
      color: '#FF0000'
    };

    useLocationStore.getState().addLocation(newLocation);
    
    expect(useLocationStore.getState().locations).toHaveLength(1);
    expect(useLocationStore.getState().locations[0]).toEqual(newLocation);
  });

  test('should update a location', () => {
    const location: Location = {
      id: '1',
      name: 'Test Location',
      lat: 41.0082,
      lng: 28.9784,
      description: 'Test Description',
      color: '#FF0000'
    };

    useLocationStore.getState().addLocation(location);
    
    const updatedLocation: Location = {
      ...location,
      name: 'Updated Location',
      description: 'Updated Description'
    };

    useLocationStore.getState().updateLocation(updatedLocation);
    
    expect(useLocationStore.getState().locations).toHaveLength(1);
    expect(useLocationStore.getState().locations[0]).toEqual(updatedLocation);
  });

  test('should delete a location', () => {
    const location: Location = {
      id: '1',
      name: 'Test Location',
      lat: 41.0082,
      lng: 28.9784
    };

    useLocationStore.getState().addLocation(location);
    expect(useLocationStore.getState().locations).toHaveLength(1);
    
    useLocationStore.getState().deleteLocation('1');
    expect(useLocationStore.getState().locations).toHaveLength(0);
  });
}); 