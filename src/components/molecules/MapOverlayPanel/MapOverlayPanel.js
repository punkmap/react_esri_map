import React, { Component } from 'react'
//import { loadModules } from 'esri-loader'
import MapSearch from '../MapSearch/MapSearch'
import './MapOverlayPanel.css'
import Grid from '@material-ui/core/Grid'
class MapOverlayPanel extends Component {
  render() {
    return (
      <div className="mapOverlayPanel">
        <Grid
          container
          spacing={16}
          alignItems="center"
          direction="row"
          justify="center"
        >
          <MapSearch 
            view={this.props.view} 
            resultPinDragable={true}
          />
        </Grid>
      </div>
    )
  }
}

export default MapOverlayPanel