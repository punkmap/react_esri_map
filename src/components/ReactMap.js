import React from 'react';
import ReactDOM from 'react-dom'
import EsriLoaderReact from 'esri-loader-react'
import { loadModules } from 'esri-loader'
import axios from 'axios'
import MapOverlayPanel from './molecules/MapOverlayPanel/MapOverlayPanel'
import PopUp from './molecules/PopUp/PopUp'
import './ReactMap.css'

class ReactMap extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      ctrlKey: false
      , mapView: null
      , parcelsFL: null
      , projectsFL: null
      , parcelAddGL : null
      , projectsAddPIN10s: null
      , project: null
      , phase:null
      , hideSidePanel: true
      , parcelData: null
      , realEstateData: null
    }
    this.mapClick = this.mapClick.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.loadExistingProjectsToMap = this.loadExistingProjectsToMap.bind(this);
  }
  componentDidMount(){
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    const self = this
    function keyDown(e) {
      if (e.ctrlKey&&!self.state.ctrlKey){
        self.setState({ctrlKey: true})
      }
    }
    function keyUp(e) {
      if (self.state.ctrlKey){self.setState({ctrlKey: false})}
    }
  }
  loadMap = ({loadedModules: [Map, MapView, FeatureLayer, GraphicsLayer, watchUtils], containerNode}) => {
    console.log('esriMapLoader');
    const self = this;
    const flURL = 'https://maps.townofcary.org/arcgis/rest/services/Property/Property/MapServer/0'
    let fl = new FeatureLayer({
        url: flURL 
        , outFields: ["OBJECTID","PIN","PIN10","Realid","Owner","Owner2","OwnerAdd1","OwnerAdd2","OwnerAdd3","Location","CalcAcreage","DeedAcres","StreetNumber","StreetMisc","StreetPrefix","StreetName","StreetType","StreetSuffix","LandClass","Lclass","TotalStructures","TotalUnits","PropertyDesc","LotNum","BldgValue","LandValue","LandSaleValue","LandSaleDate","TotalSaleValue","TotalSaleDate","DeedBook","DeedPage","WC_City","Cary_City","WC_Etj","Topography","Township","APAOwnership","APAActivity","APAFunction","APAStructure","APASite","WC_Zoning","BillingClass","APAOwnershipDesc","APAActivityDesc","APAFunctionDesc","APAStructureDesc","APASiteDesc","County","TotalBldgSqFt","Typeanduse","Typedecode","PhyCity","PhyZip","Utilities","OwnerWholeName"]
        , popupTemplate: null
    });
    fl.minScale = 2257;
    fl.when(function(featureLayer){
      console.log('when fl');
      featureLayer.id = 'parcels';
      self.setState({parcelsFL: featureLayer});
    });
    fl.renderer = {
      type: "simple"  // autocasts as new SimpleRenderer()
      , symbol: {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [ 255, 255, 0, 0.1 ],
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 1,
          color: "white"
        }
      }
    }
    const parcelAddGL = new GraphicsLayer({
      visible:true
      , id: 'parcelAddGL'
    })
    parcelAddGL.watch('graphics.length', function(newValue, oldValue, property, object) {
      console.log('GRAPHICS Layer added')
      newValue!==0?self.setState({hideSidePanel: false}):self.setState({hideSidePanel: true})
    });
    self.setState({parcelAddGL:parcelAddGL})
    
    let map = new Map({basemap: 'satellite'})
    
    map.addMany([fl, parcelAddGL])
    self.loadExistingProjectsToMap(map)
    let mv = new MapView({
      container: containerNode
      , center: [-78.78004, 35.78961]
      , zoom: 18
      , map: map
    }).when((function(mapView){
        self.setState({mapView:mapView})
        mapView.on('click', self.mapClick)
        mapView.popup.highlightEnabled = false;
        mapView.popup.actions = {}
        mapView.popup.watch('visible', function(e){
          if(e){self.setReactPopupContent()}
        })
    }));
  }
  refreshProjectFL = (callback) =>{
    const self = this;
    axios({
      method: 'post'
      , url: 'http://localhost:3001/realestate/getprojectparcels'
      
    })
    .then(function(response){
      const array = response.data
      self.setState({projectsAddPIN10s:array});
      const list = array.map(s => `'${s}'`).join(', ');
      self.state.projectsFL.definitionExpression = `PIN10 in (${list})`
      callback({'status':'success'})
    })
    .catch(function (error) {
      callback({'status':'error'})
    });
  }
  loadExistingProjectsToMap = (map) => {
    console.log('loadProjectsToMap');
    const self = this
    loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
        const flURL = 'https://maps.townofcary.org/arcgis/rest/services/Property/Property/MapServer/0'
        let fl = new FeatureLayer({
          url: flURL 
          , outFields: ["*"]
          , popupEnabled:false
        });
        fl.minScale = 2257;
        fl.when(function(featureLayer){
          featureLayer.id = 'projects';
          self.setState({projectsFL: featureLayer});
          map.reorder(self.state.parcelAddGL, 2)
          map.layers.forEach(function(layer){
            console.log('layer.id: ' + layer.id)
          })
          
          self.refreshProjectFL(function(status){})
        });
        fl.renderer = {
          type: "simple"  // autocasts as new SimpleRenderer()
          , symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: [ 255, 0, 0, 0.4 ],
            outline: {  // autocasts as new SimpleLineSymbol()
              width: 4,
              color: "red"
            }
          }
        }
        map.add(fl);
    })
  }
  setReactPopupContent = () => {
    const self = this
    
    let puNode = document.createElement("div");
    const popupContent = document.getElementsByClassName('.esri-popup__content');
    self.state.mapView.popup.content = puNode
    
    ReactDOM.render(
      <PopUp parcelData={self.state.parcelData} realEstateData={self.state.realEstateData}/>,
      puNode
    );
    //self.state.mapView.popup.open();
  }
  addFeature = (e) => {
    console.log('addFeature')
  }
  mapClick = (e) => {
    //console.log('quit clicking me mapPoint: ' + JSON.stringify(e.mapPoint));
      const self = this;
      loadModules(['esri/tasks/QueryTask','esri/tasks/support/Query'])
      .then(([QueryTask,Query]) => 
      {
        let parcels = this.state.parcelsFL;
        let URL = parcels.url+'/'+parcels.layerId;  
        //console.log('URL: '+ URL);
        var qTask = new QueryTask({
            url: URL
          });  
          var params = new Query({
                returnGeometry: true
                , outFields: ['PIN','PIN10','RealId','Owner','OwnerWholeName','Owner2','OwnerAdd1','OwnerAdd2','OwnerAdd3','DeedBook','DeedPage','Location','StreetNumber','StreetPrefix','StreetName','StreetType']
                , geometry: e.mapPoint
                , spatialRelationship: 'intersects'
          });
          qTask.execute(params)
          .then(function(response){
              if (response.features.length>0){
                console.log('response.features[0]: ' + JSON.stringify(response.features[0]));
                self.addGraphicToProjectSet(response.features[0])
                const PIN10 = response.features[0].attributes.PIN10 
                axios.post('http://localhost:3001/realestate/getprojectattributes/'+JSON.stringify(PIN10)).then(function(response){
                  const resData = response.data;
                  if(response.status===200){
                    console.log('success');
                    self.setState({realEstateData: resData})
                    // self.state.mapView.popup.open({
                    //   title: PIN10
                    //   , location : e.mapPoint
                    // })
                  }
                  else{
                    
                  }
                })
                .catch(function (error) {
                  console.log('error: ' + error)
                });
              }
              else{
                self.state.parcelAddGL.removeAll()
                self.setState({realEstateData: null})
              }
              let parcelData = JSON.parse(JSON.stringify(response.features[0].attributes))
              self.deleteObjectKeys(parcelData,['Location','StreetNumber','StreetPrefix','StreetName','StreetType'])
              console.log('set parcelData state')
              self.setState({parcelData: parcelData})
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
  deleteObjectKeys = (object,keys) => {
    keys.forEach(function(key){
      delete object[key]
    })
    console.log('return delete object keys')
    return
  }
  addGraphicToProjectSet = (graphic) =>{
    const self = this
    //loadModules(['esri/Graphic']).then(([Graphic]) => {
      var fillSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [0, 255, 255, 0.1],
        outline: { // autocasts as new SimpleLineSymbol()
          color: "00FFFF",
          width: 5
        }
      }
      graphic.symbol = fillSymbol
      if(!self.state.ctrlKey){
        self.state.parcelAddGL.removeAll();
      }
      
      if(!self.graphicInGraphicsLayer(graphic, self.state.parcelAddGL, 'PIN')){
        self.state.parcelAddGL.add(graphic)
      }
  }
  graphicInGraphicsLayer = (G, GL, idField) =>{
    let inGL = false
    GL.graphics.forEach(function(g){
      if(g.attributes[idField]===G.attributes[idField]){
        inGL = true
      }
    })
    return inGL
  }
  removeGraphicById = (G, GL, idField) =>{
    let removeGraphics = []
    GL.graphics.forEach(function(g){
      if(g.attributes[idField]===G.attributes[idField]){
        removeGraphics.push(g)
      }
    })
    
    GL.removeMany(removeGraphics)
  }
  getSelectedProperties = () => {
    const self = this
    let parceldata = []
    let array = self.state.projectsAddPIN10s
    console.log('getSelectedProperties array: '+array)
    this.state.parcelAddGL.graphics.forEach(function(g){
      let attr = g.attributes
      console.log('attr: ' + JSON.stringify(attr))
      if(array.indexOf(attr.PIN10)===-1){console.log('this shit is true')}
      if(array.indexOf(attr.PIN10)===-1){
        array.push(attr.PIN10)
      } 
      delete attr.RealLink
      delete attr.DeedLink
      console.log('self.state.project: ' + self.state.project)
      attr.Project = self.state.project
      attr.Phase = self.state.phase
      parceldata.push(attr)
    }) 
    return parceldata
  }
  addSelectedProperties = () => {
    const self = this;  
    let array = self.state.projectsAddPIN10s
    const parceldata = self.getSelectedProperties()
    axios.post('http://localhost:3001/realestate/addparcels/'+JSON.stringify(parceldata)).then(function(response){
      const resData = response.data;
      if(resData.status==='success'){
        self.refreshProjectFL(function(status){})
      }
      else if (resData.status==='warning'){
          alert(resData.message)    
      }

    })
    .catch(function (error) {
      console.log('error: ' + error)
    });
  }
  deleteSelectedProperties = () => {
    const self = this;  
    console.log('deleteSelectedProperties')
    const parceldata = self.getSelectedProperties()
    axios.post('http://localhost:3001/realestate/deleteparcels/'+JSON.stringify(parceldata)).then(function(response){
      console.log('parcelesAdded response: ' + JSON.stringify(response.data));
      const resData = response.data;
      console.log(resData)
      if(resData.status==='success'){
        self.refreshProjectFL(function(status){})        
      }
      else if (resData.status==='warning'){
          alert(resData.message)    
      }

    })
    .catch(function (error) {
      console.log('error: ' + error)
    });
  }
  setProjectCallback = (value) =>{
    const self = this
    this.setState({project:value})
    console.log('setProjectCallback self.state.project: ' + self.state.project)
  }
  setPhaseCallback = (value) =>{
    this.setState({phase:value})
    console.log(this.state.phase)
  }
  render() {

    //var fl = new FeatureLayer(url);

    const options = {
      url: 'https://js.arcgis.com/4.10/'
    };

    return (
      <div className="ReactScene">
        <EsriLoaderReact 
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView','esri/layers/FeatureLayer', 'esri/layers/GraphicsLayer', 'esri/core/watchUtils']}    
          onReady={this.loadMap}
        />
        <MapOverlayPanel 
          view={this.state.mapView} 
          resultPinDragable={true}
          //hideSidePanel={false} 
          hideSidePanel_MapOverlay={this.state.hideSidePanel} 
          addSelectedProperties = {this.addSelectedProperties}
          deleteSelectedProperties = {this.deleteSelectedProperties}
          projectCallback = {this.setProjectCallback}
          phaseCallback = {this.setPhaseCallback}
          realEstateData = {this.state.realEstateData}
          parcelData = {this.state.parcelData}
        />
        
        {/* <SidePanel ref="sidePanel" 
          hideSidePanel={false} 
          //hideSidePanel={this.state.hideSidePanel} 
          addSelectedProperties = {this.addSelectedProperties}
          deleteSelectedProperties = {this.deleteSelectedProperties}
          projectCallback = {this.setProjectCallback}
          phaseCallback = {this.setPhaseCallback}
        /> */}
        {/* <SidePanel ref="sidePanel" 
          address={this.state.address} 
          PIN={this.state.PIN} 
          realLink={this.state.realLink} 
          deedLink={this.state.deedLink} 
        /> */}
      </div>
    );
  }
}

export default ReactMap;