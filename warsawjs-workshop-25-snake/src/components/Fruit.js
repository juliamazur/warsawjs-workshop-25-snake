import React from 'react';

class Fruit extends React.Component {

    render(){
        return (
           <circle key={this.props.key} cx={this.props.cx} cy={this.props.cy} r={this.props.r} fill="lightpink" />

        );

    }

}

export default Fruit;
