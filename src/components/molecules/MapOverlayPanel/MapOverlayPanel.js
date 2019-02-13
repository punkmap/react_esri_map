import React, { Component } from 'react'
//import { loadModules } from 'esri-loader'
import MapSearch from '../MapSearch/MapSearch'
import SidePanel from '../../SidePanel'
import InfoPanel from '../InfoPanel/InfoPanel'
import './MapOverlayPanel.css'
import Grid from '@material-ui/core/Grid'
class MapOverlayPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
      hideSidePanel: true
    }
  } 
  setProjectCallback = (value) =>{
    //this.setState({project:value})
    console.log(this.state.project)
    this.props.projectCallback(value)
  }
  setPhaseCallback = (value) =>{
    //this.setState({phase:value})
    console.log(this.state.phase)
    this.props.phaseCallback(value)
  }
  componentDidUpdate = () => {
    console.log('MAPOVERLAYPANEL.componentDidUpdate this.state.hodeSidePanel: ' + this.state.hodeSidePanel)
  }
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
          <SidePanel ref="sidePanel" 
            //hideSidePanel={false} 
            hideSidePanel={this.props.hideSidePanel_MapOverlay} 
            addSelectedProperties = {this.props.addSelectedProperties}
            deleteSelectedProperties = {this.props.deleteSelectedProperties}
            projectCallback = {this.setProjectCallback}
            phaseCallback = {this.setPhaseCallback}
          />
          <InfoPanel
            parcelData={this.props.parcelData}
            realEstateData={this.props.realEstateData}
          ></InfoPanel>
        </Grid>
      </div>
    )
  }
}

export default MapOverlayPanel