import React from 'react';
import { View } from 'ol';

// the type of the context
interface contextValue {
  view: View | undefined;
  geoJSON: any | undefined;
}

const defaultValue: contextValue = {
  view: undefined,
  geoJSON: undefined,
};

export const MapContext = React.createContext<contextValue>(defaultValue);
