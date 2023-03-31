import { Map } from 'ol';
import { useContext, useEffect, useRef, useState } from 'react';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { MapContext } from './MapContext';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import React from 'react';
import { Circle as CircleStyle } from 'ol/style';
import Geolocation from 'ol/Geolocation';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { FriendLocation } from './DisplayMap';
import { fromLonLat } from 'ol/proj';
import { useTheme } from '@mui/material/styles';

import './MapRender.css';

export interface MapRenderProps {
  setLatitute: React.Dispatch<React.SetStateAction<string>>;
  setLongitude: React.Dispatch<React.SetStateAction<string>>;

  // an array of coordinates to display friends on the map
  friendLocations: FriendLocation[];

  setDisplayMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MapRender(props: MapRenderProps) {
  const theme = useTheme();
  const context = useContext(MapContext);
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  const [userLocationFound, setUserLocationFound] = useState(false);
  const [coordinates, setCoordinates] = useState('');

  // user location
  useEffect(() => {
    // create a new map
    if (ref.current && !mapRef.current) {
      // geolocation
      const geolocation = new Geolocation({
        trackingOptions: {
          enableHighAccuracy: true,
        },
        projection: context.view?.getProjection(),
      });

      const accuracyFeature = new Feature();
      geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry() as any);
      });

      // start geolocation
      geolocation.setTracking(true);

      const positionFeature = new Feature();
      positionFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({
              color: '#3399CC',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        })
      );

      geolocation.on('change:position', function () {
        // this function runs when the position changes
        const coordinates = geolocation.getPosition();
        if (coordinates) {
          setUserLocationFound(true);
          props.setDisplayMap(true);
          setCoordinates(coordinates.toString());
        }
        context.view?.setCenter(coordinates);
        context.view?.setZoom(18);
        positionFeature.setGeometry(
          coordinates ? new Point(coordinates) : (null as any)
        );

        if (coordinates) {
          const longitude = coordinates[0].toString();
          const latitute = coordinates[1].toString();

          // set prop values
          props.setLatitute(latitute);
          props.setLongitude(longitude);
        }

        // set a timeout for 5 seconds just in case position is constantly changing (user is moving)
        setTimeout(() => {}, 5000);
      });

      // wait for geolocation to get the user's location
      mapRef.current = new Map({
        layers: [
          new TileLayer({
            preload: 4,
            source: new OSM(),
          }),
        ],
        view: context.view,
        target: ref.current,
      });

      new VectorLayer({
        map: mapRef.current,
        source: new VectorSource({
          features: [positionFeature, accuracyFeature],
        }),
      });
    }
  }, [ref, mapRef, context.view]);

  // friends location
  useEffect(() => {
    if (mapRef.current !== null) {
      if (props.friendLocations) {
        const friends = new Array<Feature>();

        for (let i = 0; i < props.friendLocations.length; i++) {
          const coordinates = fromLonLat([
            parseFloat(props.friendLocations[i].longitude),
            parseFloat(props.friendLocations[i].latitute),
          ]);

          const friend = new Feature({
            geometry: new Point(coordinates),
          });

          friend.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 13,
                fill: new Fill({
                  color: 'black',
                }),
                stroke: new Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
              text: new Text({
                text: props.friendLocations[i].name,
                fill: new Fill({
                  color: 'white',
                }),
                stroke: new Stroke({
                  color: 'black',
                  width: 2,
                }),
              }),
            })
          );

          friends.push(friend);
        }

        const vectorSource = new VectorSource({
          features: friends,
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({ color: '#343177', width: 3 }),
            fill: new Fill({
              color: 'rgba(52,49,119, 0.3)',
            }),
          }),
        });
        // always add this layer to the bottom of layers
        if (mapRef.current.getLayers().getLength() > 1) {
          mapRef.current.getLayers().removeAt(1);
        }
        mapRef.current.getLayers().insertAt(1, vectorLayer);
      }
    }
  }, [props.friendLocations]);

  // geoJSON layers
  useEffect(() => {
    if (
      context.geoJSON !== null &&
      context.geoJSON !== undefined &&
      mapRef.current !== null
    ) {
      // check if context.geoJSON is undefined
      if (context.geoJSON !== undefined && context.geoJSON !== null) {
        const features = new GeoJSON().readFeatures(context.geoJSON as GeoJSON);

        const vectorSource = new VectorSource({
          format: new GeoJSON(),
          features: features,
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({ color: theme.palette.primary.main, width: 3 }),
            fill: new Fill({
              color: 'rgb(148, 97, 142, 0.3)',
            }),
          }),
        });

        // if more than 2 layers, remove the top layer
        if (mapRef.current.getLayers().getLength() > 2) {
          mapRef.current.getLayers().removeAt(2);
        }
        mapRef.current.getLayers().insertAt(2, vectorLayer);
      }
    }

    if (context.geoJSON === undefined && mapRef.current !== null) {
      if (mapRef.current.getLayers().getLength() > 2) {
        mapRef.current.getLayers().removeAt(2);
      }
    }
  }, [context.geoJSON, mapRef]);

  // useEffect(() => {
  //   console.log('coordinates', coordinates);
  //   if (coordinates !== '') {
  //     setUserLocationFound(true);
  //     props.setDisplayMap(true);
  //   }
  // }, [coordinates]);

  return (
    <div className="map-render-container">
      <div
        className={
          userLocationFound
            ? 'map-render-display map-display-off'
            : 'map-render-display map-display-on'
        }
      >
        <h1 className="loading-info">Getting your location...</h1>

        <img src="https://cdn.dribbble.com/users/2433051/screenshots/4872252/spinning-globe-white.gif"></img>
      </div>
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: userLocationFound ? 'block' : 'none',
        }}
        className={
          userLocationFound ? 'loading-display-off' : 'loading-display-on'
        }
      ></div>
    </div>
  );
}
