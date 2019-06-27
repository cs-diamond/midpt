import React, { Component } from 'react';
// import config from '../config';
import Map from '../components/Map';
import VennMap from '../components/VennMap';
import List from '../components/List';

const GoogleMapsAPI = new Promise((res, err) => {
  const script = document.createElement('script');
  document.body.appendChild(script);
  script.onload = res;
  script.onerror = err;
  script.async = true;
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=' +
    'AIzaSyC7LWO6YTQX6EzHTT3ZJVYON4UpQmnzHf0';
});

const Maps = props => {
  const mapComponents = [];
  console.log('PROPS from MAPS', props);
  if (props.result) {
    if (props.midptInfo.name) {
      mapComponents.push(
        <Map
          key={1}
          keyVal={1}
          address={props.result.address1}
          point={props.result.point1}
          midptInfo={props.midptInfo}
          url={props.result.aToMidptURL}
          midpt={props.result.midpt}
        />
      );
      mapComponents.push(
        <Map
          key={2}
          keyVal={2}
          address={props.result.address2}
          point={props.result.point2}
          midptInfo={props.midptInfo}
          url={props.result.bToMidptURL}
          midpt={props.result.midpt}
        />
      );
    }
    mapComponents.push(
      <section className="mapContainer">
        <VennMap
          key="VM"
          isochrones={props.result.isochrones}
          midpt={props.result.midpt}
          time="7:00"
          yelps={props.result.yelps}
        />
        <List result={props.result} onChoose={props.onChoose} />
      </section>
    );
  }
  return <section id="maps">{mapComponents}</section>;
};

export default Maps;
