import { Map } from 'ol';
import { useContext, useEffect, useRef, useState } from 'react';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { MapContext } from './MapContext';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import React from 'react';
import { Circle as CircleStyle } from 'ol/style';
import Geolocation from 'ol/Geolocation';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { FriendLocation } from './DisplayMap';
import { fromLonLat } from 'ol/proj';

export interface MapRenderProps {
  setLatitute: React.Dispatch<React.SetStateAction<string>>;
  setLongitude: React.Dispatch<React.SetStateAction<string>>;

  // an array of coordinates to display friends on the map
  friendLocations: FriendLocation[];
}

export function MapRender(props: MapRenderProps) {
  const context = useContext(MapContext);
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  const [locationAdded, setLocationAdded] = useState(false);

  useEffect(() => {
    // create a new map
    if (ref.current && !mapRef.current) {
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
        context.view?.setCenter(coordinates);
        context.view?.setZoom(18);
        positionFeature.setGeometry(
          coordinates ? new Point(coordinates) : (null as any)
        );

        // store these coordinates in the database

        if (coordinates) {
          const longitude = coordinates[0].toString();
          const latitute = coordinates[1].toString();

          // set prop values
          props.setLatitute(latitute);
          props.setLongitude(longitude);
        }

        // set a timeout for 5 seconds just in case position is constantly changing (user is moving)
        setTimeout(() => {
          console.log('user moving');
        }, 5000);
      });

      new VectorLayer({
        map: mapRef.current,
        source: new VectorSource({
          features: [positionFeature, accuracyFeature],
        }),
      });
    }
  }, [ref, mapRef, context.view]);

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
                radius: 15,
                fill: new Fill({
                  color: 'black',
                }),
                stroke: new Stroke({
                  color: '#fff',
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
        console.log(mapRef.current.getLayers().getLength());
      }
    }
  }, [props.friendLocations]);

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
            stroke: new Stroke({ color: '#5b9532', width: 3 }),
            fill: new Fill({
              color: 'rgb(111, 148, 98, 0.3)',
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

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
