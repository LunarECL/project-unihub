import React, { useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { MapRender } from './MapRender';
import { View } from 'ol';
import { MapContext } from './MapContext';
import { boundingExtent } from 'ol/extent';
import './DisplayMap.css';
import { usePostUserLocation, useGetFriendsLocation } from '@unihub/webapp/api';
import { toLonLat } from 'ol/proj';

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
  const [friendLocations, setFriendLocations] = useState<FriendLocation[]>([]);
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
    if (latitute === '0' || longitude === '0') {
      return;
    }

    const converted = toLonLat([
      parseFloat(longitude),
      parseFloat(latitute),
    ]).toString();

    const newLon = parseFloat(converted.split(',')[0]).toString();
    const newLat = parseFloat(converted.split(',')[1]).toString();

    usePostUserLocation(newLat, newLon);
    useGetFriendsLocation().then((res) => {
      setFriendLocations(res);
    });
  }, [latitute, longitude]);

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
