import React from 'react';
import { observer, inject } from 'mobx-react';
import MapGL, {Marker} from 'react-map-gl';
import moment from 'moment';
import MARKER_STYLE from '../markerStyle';

const token = "pk.eyJ1IjoiaWRlYWx0eXBpY2FsIiwiYSI6ImNqazBjcG1tZDA1ZjIzcHFsY3NzeDZjbGUifQ.TKZIYgbzt9g7HVfScLh2cg";

@inject('ScavengerHuntStore')

@observer
export default class ScavengerHuntStore extends React.Component {
  constructor() {
    super();

    this.state = {
      viewport: {
        latitude: 43.6532,
        longitude: -79.3832,
        zoom: 16,
        bearing: 0,
        pitch: 50,
        width: window.innerWidth,
        height: window.innerHeight
      },
      settings: {
        dragPan: true,
        dragRotate: true,
        scrollZoom: true,
        touchZoomRotate: true,
        doubleClickZoom: true,
        minZoom: 0,
        maxZoom: 20,
        minPitch: 0,
        maxPitch: 85
      }
    };
  }

  renderMarker = (checkin) => {
    if (checkin.lat != undefined) {
      return (
        <Marker key={checkin.captured_at} longitude={checkin.lon} latitude={checkin.lat} >
        <div className="station">
        <span>{moment(checkin.captured_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </div>
        </Marker>
      );
    } else {
      return (
        <Marker key="0" longitude="-79.3832" latitude="43.6532" >
          <div className="station">
            <span></span>
          </div>
        </Marker>
      );
    }
  }

  onViewportChange = (viewport) => {
    this.setState({viewport});
  }

  viewport = () => {
    const {ScavengerHuntStore} = this.props;
    let latitude = 43.6532;
    let longitude = -79.3832;

    if (ScavengerHuntStore.checkin.lat != undefined) {
      latitude = ScavengerHuntStore.checkin.lat;
      longitude = ScavengerHuntStore.checkin.lon;
    }

    return {
      ...this.state.viewport,
      latitude,
      longitude
    };
  }

  render() {
    const {ScavengerHuntStore} = this.props;
    const viewport = this.viewport();

    return (
      <MapGL
        {...viewport}
        {...this.state.settings}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={token} >
        <style>{MARKER_STYLE}</style>
        { this.renderMarker(ScavengerHuntStore.checkin) }
      </MapGL>
    );
  }
}