import React, { useEffect, useState } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import { MapRender } from './MapRender';
import { DisplaySideBar } from './DisplaySideBar';
import { View } from 'ol';
import { MapContext } from './MapContext';
import { boundingExtent } from 'ol/extent';
import './DisplayMap.css';
import { usePostUserLocation, useGetFriendsLocation } from '@unihub/webapp/api';
import { toLonLat } from 'ol/proj';
import {
  geoJSON_IC,
  geoJSON_AA,
  geoJSON_AC,
  geoJSON_BV,
  geoJSON_EV,
  geoJSON_HL,
  geoJSON_HW,
  geoJSON_MW,
  geoJSON_SW,
  geoJSON_SC,
} from './assets/GeoJSON_files';

import {
  building_EV,
  building_IC,
  building_HL,
  building_AA,
  building_SW,
  building_HW,
  building_BV,
  building_AC,
  building_MW,
  restaurtant_Starbucks,
  restaurant_MarketPlaceTims,
  restaurant_Subway,
  restaurant_HeroBurger,
  restaurant_KFC,
} from './assets/BuildingCoordinates';
import { useTheme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface DisplayMapProps {}

export interface FriendLocation {
  latitute: string;
  longitude: string;
  name: string;
  time: string;
}

export function DisplayMap(props: DisplayMapProps) {
  const theme = useTheme();
  const [latitute, setLatitute] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [friendLocations, setFriendLocations] = useState<FriendLocation[]>([]);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);

  const defaultPosition = fromLonLat([-79.18725541486484, 43.78422061706888]);

  const defaultView = new View({
    center: defaultPosition,
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

  // function taken from offical OpenLayers website
  // https://openlayers.org/en/latest/examples/animation.html
  function flyTo(location: any, done: any, type: string) {
    const duration = 2000;
    let zoom = context.getZoom();
    zoom = 19;

    if (type === 'restaurant') {
      zoom = 20;
    }

    // if (type === 'default') {
    //   zoom = 17;
    // }

    let parts = 2;
    let called = false;

    function callback(complete: any) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    context.animate(
      {
        center: location,
        duration: duration,
      },
      callback
    );
    context.animate(
      {
        zoom: zoom - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback
    );
  }

  function changeMapFocus(
    location: string,
    latitude?: string,
    longitude?: string
  ) {
    // change the map focus to the location (include animations)
    if (location.includes('IC')) {
      // animate the map to the location
      flyTo(building_IC, function () {}, 'building');
      // we also want to draw over the building on the map
      setGeoJSON(geoJSON_IC as any);
    } else if (location.includes('SW')) {
      flyTo(building_SW, function () {}, 'building');
      setGeoJSON(geoJSON_SW as any);
    } else if (location.includes('HW')) {
      flyTo(building_HW, function () {}, 'building');
      setGeoJSON(geoJSON_HW as any);
    } else if (location.includes('BV')) {
      flyTo(building_BV, function () {}, 'building');
      setGeoJSON(geoJSON_BV as any);
    } else if (location.includes('HL')) {
      flyTo(building_HL, function () {}, 'building');
      setGeoJSON(geoJSON_HL as any);
    } else if (location.includes('AA')) {
      flyTo(building_AA, function () {}, 'building');
      setGeoJSON(geoJSON_AA as any);
    } else if (location.includes('EV')) {
      flyTo(building_EV, function () {}, 'building');
      setGeoJSON(geoJSON_EV as any);
    } else if (location.includes('AC')) {
      flyTo(building_AC, function () {}, 'building');
      setGeoJSON(geoJSON_AC as any);
    } else if (location.includes('MW')) {
      flyTo(building_MW, function () {}, 'building');
      setGeoJSON(geoJSON_MW as any);
    } else if (location.includes('Starbucks')) {
      flyTo(restaurtant_Starbucks, function () {}, 'restaurant');
      setGeoJSON(geoJSON_SW as any);
    } else if (location.includes('Subway')) {
      flyTo(restaurant_Subway, function () {}, 'restaurant');
      setGeoJSON(geoJSON_SC as any);
    } else if (location.includes('Tim Hortons')) {
      flyTo(restaurant_MarketPlaceTims, function () {}, 'restaurant');
      setGeoJSON(geoJSON_HW as any);
    } else if (location.includes('Hero Burger')) {
      flyTo(restaurant_HeroBurger, function () {}, 'restaurant');
      setGeoJSON(geoJSON_SC as any);
    } else if (location.includes('KFC')) {
      flyTo(restaurant_KFC, function () {}, 'restaurant');
      setGeoJSON(geoJSON_SC as any);
    } else if (location.includes('friend')) {
      if (
        latitude !== '360' &&
        latitude !== '-360' &&
        longitude !== '360' &&
        longitude !== '-360'
      ) {
        flyTo(
          fromLonLat([parseFloat(longitude!), parseFloat(latitude!)]),
          function () {},
          'friend'
        );
        // don't draw over the map
        setGeoJSON(undefined);
      } else {
        alert('Invalid Location');
        // flyTo(defaultPosition, function () {}, 'default');
      }
    }
  }

  return (
    <MapContext.Provider value={{ view: context, geoJSON: geoJSON }}>
      <div>
        <div
          className={
            sideBarOpen
              ? 'mapContainer mapSideBar'
              : 'mapContainer mapNoSideBar'
          }
        >
          <MapRender
            setDisplayMap={setDisplayMap}
            setLatitute={setLatitute}
            setLongitude={setLongitude}
            friendLocations={friendLocations}
          />
          <button
            className={displayMap ? 'filterBtn' : 'noFilterBtn'}
            style={{ backgroundColor: theme.palette.secondary.main }}
            onClick={() => setSideBarOpen(!sideBarOpen)}
          >
            {sideBarOpen ? 'Close' : 'Filter'}
          </button>
        </div>

        <div className={sideBarOpen ? 'sideBarContent' : 'noSideBarContent'}>
          <DisplaySideBar changeMapFocus={changeMapFocus} />
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default DisplayMap;
