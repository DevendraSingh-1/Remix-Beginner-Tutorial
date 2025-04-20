// app/services/location.service.ts
export interface Location {
    locationId: string;
    userId: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  let locations: Location[] = [];
  
  export const locationService = {
    async createLocation(locationData: {
      userId: string;
      latitude: number;
      longitude: number;
      address?: string;
      city?: string;
      country?: string;
    }) {
      const newLocation: Location = {
        locationId: crypto.randomUUID(),
        ...locationData,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      // Set as default if first location
      if (!locations.some(l => l.userId === locationData.userId)) {
        newLocation.isDefault = true;
      }
  
      locations.push(newLocation);
      return newLocation;
    },
  
    async setDefaultLocation(userId: string, locationId: string) {
      locations = locations.map(l => {
        if (l.userId === userId) {
          return { ...l, isDefault: l.locationId === locationId };
        }
        return l;
      });
    },
  
    async getUserLocations(userId: string) {
      return locations.filter(l => l.userId === userId);
    },
  };
  