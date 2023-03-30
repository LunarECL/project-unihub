import { Map } from 'ol';
import { useContext, useEffect, useRef } from 'react';
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

function MapRender() {
  // our context
  const context = useContext(MapContext);

  // current ref
  const ref = useRef<HTMLDivElement>(null);

  // map ref
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    // if ref.current is not null and mapRef.current is null
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
        projection: context.view.getProjection(),
      });

      geolocation.on('change:position', () => {
        const coordinates = geolocation.getPosition();
        context.view.setCenter(coordinates);
        context.view.setZoom(18);
      });

      const accuracyFeature = new Feature();
      geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
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
        const coordinates = geolocation.getPosition();
        positionFeature.setGeometry(
          coordinates ? new Point(coordinates) : null
        );
      });

      console.log('positionFeature', positionFeature);

      new VectorLayer({
        map: mapRef.current,
        source: new VectorSource({
          features: [accuracyFeature, positionFeature],
        }),
      });
    }
  }, [ref, mapRef, context.view]);

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
            stroke: new Stroke({ color: '#343177', width: 3 }),
            fill: new Fill({
              color: 'rgba(52,49,119, 0.3)',
            }),
          }),
        });
        // remove previous layer if it exists
        if (mapRef.current.getLayers().getLength() > 1) {
          mapRef.current.getLayers().removeAt(1);
        }
        mapRef.current.addLayer(vectorLayer);
      }
    }
  }, [context.geoJSON, mapRef]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}

export default MapRender;
