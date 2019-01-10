import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import SidePanel from './SidePanel'
import './ReactMap.css';
import { loadModules } from 'esri-loader'
import MapOverlayPanel from './molecules/MapOverlayPanel/MapOverlayPanel';

class ReactMap extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      mapView: null
      , parcelsFL: null
      , address: null
      , PIN: null
      , realLink: null
      , deedLink: null
    }
    console.log('this.state: ' + JSON.stringify(this.state));
    this.mapClick = this.mapClick.bind(this);
    this.loadMap = this.loadMap.bind(this);
  }
  loadMap = ({loadedModules: [Map, MapView, FeatureLayer], containerNode}) => {
    console.log('esriMapLoader');
    const self = this;
    const flURL = 'https://maps.townofcary.org/arcgis/rest/services/Property/Property/MapServer/0'
    let fl = new FeatureLayer(flURL);
    fl.minScale = 2257;
    fl.when(function(featureLayer){
      console.log('when fl');
      featureLayer.id = 'parcels';
      console.log('e.url: ' + featureLayer.url);
      self.setState({parcelsFL: featureLayer});
    });
    fl.renderer = {
      type: "simple"  // autocasts as new SimpleRenderer()
      , symbol: {
        type: "simple-line"  // autocasts as new SimpleLineSymbol()
        , color: "yellow"
        , width: "2px"
      }
    }
    let map = new Map({basemap: 'satellite', layers:[fl]})
    let mv = new MapView({
      container: containerNode
      , center: [-78.78004, 35.78961]
      , zoom: 18
      , map: map
    }).when((function(mapView){
      mapView.on('click', self.mapClick)
      self.setState({mapView:mapView})
  }));
  }
  
  mapClick = (e) => {
    console.log('quit clicking me mapPoint: ' + JSON.stringify(e.mapPoint));
      console.timeEnd('map loaded')
      const self = this;
      loadModules(['esri/tasks/QueryTask','esri/tasks/support/Query'])
      .then(([QueryTask,Query]) => 
      {
        let parcels = this.state.parcelsFL;
        let URL = parcels.url+'/'+parcels.layerId;  
        console.log('URL: '+ URL);
        var qTask = new QueryTask({
            url: URL
          });  
          var params = new Query({
                returnGeometry: true
                , outFields: ['*']
                , geometry: e.mapPoint
                , spatialRelationship: 'intersects'
          });
          qTask.execute(params)
          .then(function(response){
              console.log('response: ' + JSON.stringify(response.features[0].attributes));
              console.log('response: ' + JSON.stringify(response.features[0].attributes.RealLink));
              self.setState({address: response.features[0].attributes.Location});
              self.setState({PIN: response.features[0].attributes.PIN});
              self.setState({realLink: response.features[0].attributes.RealLink});
              self.setState({deedLink: response.features[0].attributes.DeedLink});
          })
          .catch(function(error){
              console.log('error: ' + JSON.stringify(error));
          });
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      }); 
  }
  render() {

    //var fl = new FeatureLayer(url);

    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };

    return (
      <div className="ReactScene">
        <EsriLoaderReact 
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView','esri/layers/FeatureLayer']}    
          onReady={this.loadMap}
        />
        <MapOverlayPanel 
          view={this.state.mapView} 
          resultPinDragable={true}
        />
        <SidePanel ref="sidePanel" address={this.state.address} PIN={this.state.PIN} realLink={this.state.realLink} deedLink={this.state.deedLink} />
      </div>
    );
  }
}

export default ReactMap;