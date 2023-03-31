import React, { useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { MapRender } from './MapRender';
import { View } from 'ol';
import { MapContext } from './MapContext';
import { boundingExtent } from 'ol/extent';
import './DisplayMap.css';
import { usePostUserLocation } from '@unihub/webapp/api';

/* eslint-disable-next-line */
export interface DisplayMapProps {}

export function DisplayMap(props: DisplayMapProps) {
  const [latitute, setLatitute] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const defaultView = new View({
    center: fromLonLat([-79.18725541486484, 43.78422061706888]),
    zoom: 17,

    // the constraints for the map
    extent: boundingExtent([
      fromLonLat([-79.1951, 43.78]),
      fromLonLat([-79.1751, 43.7944]),
    ]),
  });

  // the context that will be passed to the map
  const [context, setContext] = useState<View>(defaultView);
  const [geoJSON, setGeoJSON] = useState(undefined);

  useEffect(() => {
    setContext(context);
  }, [context]);

  useEffect(() => {
    usePostUserLocation(latitute, longitude);
  }, [latitute, longitude]);

  return (
    <MapContext.Provider value={{ view: context, geoJSON: geoJSON }}>
      <div>
        <div className="mapContainer" style={{ width: '100%' }}>
          <MapRender setLatitute={setLatitute} setLongitude={setLongitude} />
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default DisplayMap;
