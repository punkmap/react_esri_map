import React from 'react';
class PopUp extends React.Component {
    
    componentDidMount() {
        console.log('componentDidMount')
    }
    componentDidUpdate() {
        console.log('componentDidUpdate')
    }
    render() {
      
      return (
        <div>
          <p>Put your rad popup content here</p>
        </div>
      );
    }
  }
export default PopUp;