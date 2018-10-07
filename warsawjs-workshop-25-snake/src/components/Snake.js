import React from 'react';

class Snake extends React.Component {



    moveDown = () => {
        this.setPosition(this.state.cx, this.state.cy + 10);
    }

    setPosition = (cx, cy) => {
        this.setState({
            cx: cx,
            cy: cy,
        });
    }



    render(){
        return (
            this.props.snakeSegments.map((segment, index) => {
                return (
                    <circle key={index} cx={segment.cx} cy={segment.cy} r={segment.r} fill="lightgreen" />
                )
              })
        );

    }

}

export default Snake;
