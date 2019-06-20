import React, { Component } from 'react';

const initMap = (point, id, midptInfo) => {
  //console.log('midpt in maps.js', midpt);
  let service = new window.google.maps.DirectionsService();
  let display = new window.google.maps.DirectionsRenderer();
  const pointStr = point.lat + ',' + point.lng;
  const midptStr = midptInfo.coordinates.lat + ',' + midptInfo.coordinates.lng;
  console.log(midptInfo);
  let map = new window.google.maps.Map(document.getElementById(id), {
    zoom: 7,
    center: { lat: midptInfo.coordinates.lat, lng: midptInfo.coordinates.lng }
  });
  display.setMap(map);
  service.route(
    {
      origin: pointStr,
      destination: midptStr,
      travelMode: 'DRIVING'
    },
    (response, status) => {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        console.log('Google Maps directions req failed, status:', status);
      }
    }
  );
};

const Map = props => {
  const id = 'map' + props.keyVal;
  setTimeout(() => {
    initMap(props.point, id, props.midptInfo);
  }, 500);
  // split address string from server into its parts (for display)
  const addressParts = props.address.split(', ');
  const address = addressParts[0];
  const city = addressParts[1];
  const state = addressParts[2];
  // state.replace(/[^\d](\d{5})[^\d]/g, '');
  const cityState = city + ', ' + state;
  return (
    <div className="mapContainer">
      <div className="titleBar">
        <span>
          <strong>{'From ' + address}</strong>
          {' (' + city + ') '}
          <strong>{'to ' + props.midptInfo.name}</strong>
        </span>
        <a href={props.url} target="_blank">Directions</a>
      </div>
      <figure className="map" id={id} />
    </div>
  );
};

export default Map;
