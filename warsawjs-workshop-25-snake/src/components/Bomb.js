import React from 'react';

class Bomb extends React.Component {

    render(){
        return (
           <circle cx={this.props.cx} cy={this.props.cy} r={this.props.r} fill="darkgrey" />

        );

    }

}

export default Bomb;
