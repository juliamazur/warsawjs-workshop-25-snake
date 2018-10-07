import React, { Component } from 'react';
import Snake from './components/Snake';
import Fruit from './components/Fruit';
import './App.css';

class App extends Component {

  static defaultProps = {
    boardWidth: 300,
    boardHeight: 300,
    r: 10,
    fruitR: 7,
    speed: 100,
  };

  constructor(props) {
        super(props);

        let gameInterval = setInterval(this.tick, this.props.speed);
        this.state = {
            gameInterval: gameInterval,
            growth: 0,
            direction: {
                x: 1,
                y: 0,
            },
            snakeSegments: [
                {
                    cx: 50,
                    cy: 50,
                },
                {
                    cx: 70,
                    cy: 50,
                },
                {
                    cx: 90,
                    cy: 50,
                },
            ],
            fruits: [],
        };
    }

  moveSnake = () => {
      let snakeSegments = this.state.snakeSegments.slice();
      let growth = this.state.growth;

      const oldHead = snakeSegments[0];
      let newHead = {...oldHead};
      // TODO waz ucieka
      newHead.cx = (oldHead.cx + 2 * this.props.r * this.state.direction.x + this.props.boardWidth) % this.props.boardWidth;
      newHead.cy = (oldHead.cy + 2 * this.props.r * this.state.direction.y + this.props.boardHeight) % this.props.boardHeight;
      if (!growth) {
          snakeSegments.splice(-1,1);
      } else {
          growth--;
      }

      snakeSegments.unshift(newHead);

      const newState = {
          ...this.state,
          snakeSegments: snakeSegments,
          growth: growth,
      };
      this.setState(newState);
      return;
  }

  showNewFruits = () => {
      if(Math.floor((Math.random() * 10) + 1) !== 1) {
         return;
      }

      const newFruit = {
          cx: 10 * Math.floor((Math.random() * 30) + 1),
          cy: 10 * Math.floor((Math.random() * 30) + 1),
      }

      let fruits = this.state.fruits.slice();
      fruits.push(newFruit);

      const newState = {
          ...this.state,
          fruits: fruits,
      };
      this.setState(newState);
      return;
  }

  hideRottenFruits = () => {
      if(Math.floor((Math.random() * 30) + 1) !== 1) {
          return;
      }

      let fruits = this.state.fruits.slice();

      fruits.splice(-1,1);

      const newState = {
          ...this.state,
          fruits: fruits,
      };
      this.setState(newState);
      return;
   }

  eatFruits = () => {
    let growth = this.state.growth;
    let fruits = this.state.fruits.slice();
    const snakeHead = this.state.snakeSegments[0];

    fruits.map(((fruit, index) => {
      if(this.doItemsCollide(snakeHead, fruit)) {
          fruits.splice(index, 1);
          growth++;
      }
    }))

      const newState = {
          ...this.state,
          fruits: fruits,
          growth: growth,
      };
      this.setState(newState);
      return;
  }

  setDirection = (x, y)  => {
    const newState = {
        ...this.state,
        direction: {
            x: x,
            y: y,
        },
    };
    this.setState(newState);
  }

  doItemsCollide = (a, b) => {
    const minRequiredDistance = 17; //szpachla
    return Math.abs(a.cx - b.cx) < minRequiredDistance
      && Math.abs(a.cy - b.cy) < minRequiredDistance;
  }

  tick = () => {
    // console.log('tick');
    this.eatFruits();
    this.moveSnake();
    this.showNewFruits();
    this.hideRottenFruits();
   }

   togglePause = ()  => {
       if (this.state.paused) {
         this.start();
       } else {
         this.pause();
       }
   }

   pause = ()  => {
        // TODO nie modyfikowac state
       clearInterval(this.state.gameInterval);
       const newState = {
           ...this.state,
           paused: true,
       };
       this.setState(newState);
   }

   start = ()  => {
       let gameInterval = setInterval(this.tick, this.props.speed);
       const newState = {
           ...this.state,
           gameInterval: gameInterval,
           paused: false,
       };
       this.setState(newState);
   }

    componentDidMount() {
        window.addEventListener('keydown', (e) => {
            // console.log('keydown');
            // console.log(e.keyCode);
            // down
            if (e.keyCode === 40) {
                this.setDirection(0,1);
            }
            // up
            if (e.keyCode === 38) {
                this.setDirection(0,-1);
            }
            // left
            if (e.keyCode === 37) {
                this.setDirection(-1,0);
            }
            // right
            if (e.keyCode === 39) {
                this.setDirection(1,0);
            }
        })
        window.addEventListener('keypress', (e) => {
            // console.log('keypress');
            // console.log(e.keyCode);
            if (e.keyCode === 32) {
              this.togglePause();
            }
        });
    }

  render() {
    return (
      <div className="App">
        <div className="board">
          <svg height={this.props.boardHeight} width={this.props.boardWidth}>
            <Snake snakeSegments={this.state.snakeSegments} r={this.props.r}/>
              {
                  this.state.fruits.map((fruit, index) => {
                      return (
                          <Fruit key={index} cx={fruit.cx} cy={fruit.cy} r={this.props.fruitR} />
                      )
                  })
              }
          </svg>
        </div>
      </div>
    );
  }
}

export default App;