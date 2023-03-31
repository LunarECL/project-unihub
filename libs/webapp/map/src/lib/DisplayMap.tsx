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

export interface FriendLocation {
  latitute: string;
  longitude: string;
  name: string;
  time: string;
}

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

  // make 3 sets of FriendLocation close to lat: 5432538.122139835, lon: -8814578.24438671, named "Friend 1", "Friend 2", "Friend 3"
  const friendLocations: FriendLocation[] = [
    {
      latitute: ' 43.786841460411296',
      longitude: '-79.18970352907695',
      name: 'Friend 1',
      time: '2021-04-20T20:00:00.000Z',
    },
    {
      latitute: '43.784731388083195',
      longitude: '-79.18610616855035',
      name: 'Friend 2',
      time: '2021-04-20T20:00:00.000Z',
    },
    {
      latitute: '43.7844441599168',
      longitude: '-79.18737030473145',
      name: 'Friend 3',
      time: '2021-04-20T20:00:00.000Z',
    },
  ];

  return (
    <MapContext.Provider value={{ view: context, geoJSON: geoJSON }}>
      <div>
        <div className="mapContainer" style={{ width: '100%' }}>
          <MapRender
            setLatitute={setLatitute}
            setLongitude={setLongitude}
            friendLocations={friendLocations}
          />
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default DisplayMap;
