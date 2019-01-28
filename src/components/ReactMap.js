import React from 'react';
import ReactDOM from 'react-dom'
import EsriLoaderReact from 'esri-loader-react'
import SidePanel from './SidePanel'
import './ReactMap.css'
import { loadModules } from 'esri-loader'
import MapOverlayPanel from './molecules/MapOverlayPanel/MapOverlayPanel'
import PopUp from './molecules/PopUp/PopUp'
import axios from 'axios'


import remove from '../assets/remove.png'

// import Fab from '@material-ui/core/Fab';
// import Icon from '@material-ui/core/Icon';

class ReactMap extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      ctrlKey: false
      , mapView: null
      , parcelsFL: null
      , projectsFL: null
      , projectsAddPIN10s: null
      , projectNumber: null
      , phase:null
      , parcelAddGL : null
      , address: null
      , PIN: null
      , realLink: null
      , deedLink: null
      , hideSidePanel: true
    }
    console.log('this.state: ' + JSON.stringify(this.state));
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
        // , popupTemplate: {
        //     title: "Property Information: {PIN10}",
        //     actions: [{
        //       id: "remve-parcel",
        //       image: remove,
        //       title: "Remove Parcel"
        //     }],
        //     // content: [{
        //     //   type: "fields",
        //     //   fieldInfos: [{
        //     //     fieldName: "PIN10"
        //     //   }]
               
        //     // }]
        //     highlightEnabled: false,
        //     content: self.getPopupContent
        // }
    });
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
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: [ 255, 255, 0, 0.2 ],
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
      console.log('self.state.hideSidePanel: ' + self.state.hideSidePanel)
      newValue!==0?self.setState({hideSidePanel: false}):self.setState({hideSidePanel: true})
      console.log('self.state.hideSidePanel: ' + self.state.hideSidePanel)
    });
    self.setState({parcelAddGL:parcelAddGL})
    
    let map = new Map({basemap: 'satellite'})
    
    map.addMany([fl, parcelAddGL])
    console.log('map.layers: ' + map.layers);
    self.loadExistingProjectsToMap(map)
    let mv = new MapView({
      container: containerNode
      , center: [-78.78004, 35.78961]
      , zoom: 18
      , map: map
    }).when((function(mapView){
        mapView.on('click', self.mapClick)
        self.setState({mapView:mapView})
        mapView.popup.highlightEnabled = false;
        // mapView.popup.watch('visible', function(e){
        //   console.log(JSON.stringify(e))
        //   console.log('look at me fool')
        //   self.setReactPopupContent()
        // })
        // var popup = mapView.popup;
        // popup.viewModel.on("trigger-action", function(event) {
        //   if (event.action.id === "remove-parcel") {
        //     var attributes = popup.viewModel.selectedFeature.attributes;
        //   }
        // });
    }));
  }
  loadExistingProjectsToMap = (map) => {
    console.log('loadProjectsToMap');
    const self = this
    loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
      axios({
        method: 'post'
        , url: 'http://localhost:3001/getprojectparcels'
        
      })
      .then(function(response){
        console.log('response.data: ' + JSON.stringify(response.data))
        console.log('response.data.length: ' + response.data.length)
        const array = response.data
        self.setState({projectsAddPIN10s:array});
        const list = array.map(s => `'${s}'`).join(', ');
        console.log(`select * from tableName where id in (${list})`);
        const flURL = 'https://maps.townofcary.org/arcgis/rest/services/Property/Property/MapServer/0'
        console.log('loadExistingProjectsToMap1')
        let fl = new FeatureLayer({
          url: flURL 
          , outFields: ["*"]
          , popupEnabled:false
        });
        console.log('loadExistingProjectsToMap2')
        fl.minScale = 2257;
        console.log('loadExistingProjectsToMap3')
        fl.when(function(featureLayer){
          console.log('when projects fl');
          featureLayer.id = 'projects';
          console.log('projects e.url: ' + featureLayer.url);
          self.setState({projectsFL: featureLayer});
          map.reorder(self.state.parcelAddGL, 2)
          map.layers.forEach(function(layer){
            console.log('layer.id: ' + layer.id)
          })
        });
        console.log('loadExistingProjectsToMap4')
        fl.definitionExpression = `PIN10 in (${list})`
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
      .catch(function (error) {
        console.log('error: ' + error)
      });
    })
  }
  getPopupContent = (target) => {
    const self = this
    const graphic = target.graphic;
    if (self.graphicInGraphicsLayer(graphic, self.state.parcelAddGL, 'PIN')&&self.state.parcelAddGL.graphics.length > 0){
      self.removeGraphicById(graphic, self.state.parcelAddGL, 'PIN')
    }
    else{
      
      const attributes = graphic.attributes;
      self.addGraphicToProjectSet(graphic)
      const data = {firstname:'Fred', lastname:'flintstone'}
      return axios.post('http://localhost:3001/hitnodeapp/' + JSON.stringify(data))
      .then(function(response){
        console.log('response.data: ' + response.data);
        //http://services.wakegov.com/realestate/Account.asp?id=0132521","DeedLink":"http://services.wakegov.com/booksweb/GenExtSearch.aspx?BookPage=004829-00200"
        return '<b>I am from Node.js: '+response.data.info+'</b>'+
          "<ul>" +
          "<li> PIN10 " + attributes.PIN10 +
          "</li>" +
          "<li> Realid: " + attributes.Realid +
          "</li>" +
          "<li> Site Address: " + attributes.Location +
          "</li>" +
          "</ul>";
      })
      .catch(function (error) {
        console.log('error: ' + error)
      });
    }
    
  }
  addFeature = (e) => {
    console.log('addFeature')
  }
  mapClick = (e) => {
    console.log('quit clicking me mapPoint: ' + JSON.stringify(e.mapPoint));
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
              self.setState({address: response.features[0].attributes.Location});
              self.setState({PIN: response.features[0].attributes.PIN});
              self.setState({realLink: response.features[0].attributes.RealLink});
              self.setState({deedLink: response.features[0].attributes.DeedLink});
              self.state.mapView.popup.open({
                title: 'this is my popup'
                , location : e.mapPoint
                , content: ''
              })
              self.setReactPopupContent()
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
  setReactPopupContent = () => {
    const self = this
    
    let puNode = document.createElement("div");
    
    self.state.mapView.popup.content = puNode
    
    
    // function Button(props) {
    //   return <button onClick={props.onClick}>Say Hello</button>;
    // }
    
    function HelloButton() {
      // function handleClick() {
      //   alert('Hello!');
      // }
      return <p>ReactPopup</p>;
    }
    
    ReactDOM.render(
      <PopUp />,
      puNode
    );
  }
  addGraphicToProjectSet = (graphic) =>{
    const self = this
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      var fillSymbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [0, 255, 255, 0.1],
        outline: { // autocasts as new SimpleLineSymbol()
          color: "00FFFF",
          width: 5
        }
      }
      graphic.symbol = fillSymbol
      // console.log('addGraphic')
      // console.log('self.state.ctrlKey: ' + self.state.ctrlKey)
      if(!self.state.ctrlKey){
        self.state.parcelAddGL.removeAll();
      }
      
      if(!self.graphicInGraphicsLayer(graphic, self.state.parcelAddGL, 'PIN')){
        self.state.parcelAddGL.add(graphic)
      }
      //if (self.graphicInGraphicsLayer(graphic, self.state.parcelAddGL, 'PIN')&&self.state.parcelAddGL.length > 0){
      
      console.log('self.state.parcelAddGL.graphics.length: ' + self.state.parcelAddGL.graphics.length);
      // console.log('addGraphic')  
    });
  }
  test = () =>{
    console.log('test')
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
  addSelectedProperties = () => {
    const self = this;  
    console.log('addSelectedProperties')
      const parceldata = []
      let array = self.state.projectsAddPIN10s
      this.state.parcelAddGL.graphics.forEach(function(g){
        let attr = g.attributes
        if(array.indexOf(attr.PIN10)===-1){console.log('this shit is true')}
        if(array.indexOf(attr.PIN10)===-1){
          array.push(attr.PIN10)
        } 
        delete attr.RealLink
        delete attr.DeedLink
        attr.ProjectNumber = self.state.projectNumber
        attr.Phase = self.state.phase
        parceldata.push(attr)
      }) 
      self.state.projectsFL.refresh()
      axios.post('http://localhost:3001/addparcels/'+JSON.stringify(parceldata)).then(function(response){
        console.log('parcelesAdded response: ' + JSON.stringify(response.data));
        const resData = response.data;
        console.log(resData)
        if(resData.status==='success'){
          const list = array.map(s => `'${s}'`).join(', ');
          self.state.projectsFL.definitionExpression = `PIN10 in (${list})`
        }
        else{

        }

      })
      .catch(function (error) {
        console.log('error: ' + error)
      });
  }
  projectPhaseCallback = (type, value) =>{
    console.log('type: ' + type + " & value: " +value)
    this.setState({type:value})
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
        />
        <SidePanel ref="sidePanel" 
          hideSidePanel={this.state.hideSidePanel} 
          addSelectedProperties = {this.addSelectedProperties}
          projectPhaseCallback = {this.projectPhaseCallback}
        />
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