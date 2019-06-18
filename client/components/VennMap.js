import React, { Component } from 'react';

function initMap(isochrones, midpt) {
  let map = new google.maps.Map(document.getElementById('vennMap'), {
    zoom: 10,
    center: midpt,
    mapTypeId: 'roadmap'
  });
  let polyAPaths = isochrones[0];
  // To close a GMaps polygon: first point in array must equal last point
  polyAPaths.push(polyAPaths[0]);
  let polyBPaths = isochrones[1];
  // To close a GMaps polygon: first point in array must equal last point
  polyBPaths.push(polyBPaths[0]);
  let polyA = new google.maps.Polygon({
    paths: polyAPaths,
    strokeColor: '#c23b22',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#c23b22',
    fillOpacity: 0.35
  });
  polyA.setMap(map);
  let polyB = new google.maps.Polygon({
    paths: polyBPaths,
    strokeColor: '#7c9ec3',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#7c9ec3',
    fillOpacity: 0.35
  });
  polyB.setMap(map);
};

const VennMap = (props) => {
  setTimeout(() => {
    initMap(props.isochrones, props.midpt);
  }, 1000);
  return (
    <div>
    <div className="mapContainer">
      <figure key="VM" className="map" id="vennMap"></figure>
    </div>
    </div>
  );
};

// <div className="mainInfo">
//   <span>{'Leaving at ' + props.time + ', it should take each of you about 43 mins to arrive at the midpoint.'}</span>
// </div>


export default VennMap;
