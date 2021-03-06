import React, { Component } from 'react';
import Snake from './components/Snake';
import Fruit from './components/Fruit';
import Bomb from './components/Bomb';
import './App.css';

class App extends Component {

  gameInterval = null;

  static defaultProps = {
    boardWidth: 300,
    boardHeight: 300,
    speed: 100,
  };

  defaultState = {
      paused: false,
      gameOver: false,
      growth: 0,
      direction: {
          x: 1,
          y: 0,
      },
      snakeSegments: [
          {
              cx: 50,
              cy: 50,
              r: 10,
          },
      ],
      fruits: [],
      bombs: [],
  };

  state = this.defaultState;

  moveSnake = () => {
      let snakeSegments = this.state.snakeSegments.slice();
      let growth = this.state.growth;

      const oldHead = snakeSegments[0];
      let newHead = {...oldHead};
      newHead.cx = (oldHead.cx + 2 * oldHead.r * this.state.direction.x + this.props.boardWidth) % this.props.boardWidth;
      newHead.cy = (oldHead.cy + 2 * oldHead.r * this.state.direction.y + this.props.boardHeight) % this.props.boardHeight;
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

  dieIfCollide = () => {
      const snakeHead = this.state.snakeSegments[0];
      this.state.snakeSegments.map(((segment, index) => {
          if(index !== 0 && this.doItemsCollide(snakeHead, segment)) {
              this.gameOver();
          }
          return true;
      }))
  }

  gameOver = () => {
      this.pause();
      const newState = {
          ...this.state,
          gameOver: true,
      };
      this.setState(newState);
  }

  showNewFruits = () => {
      if(this.state.fruits.length > 9 || Math.floor((Math.random() * 10) + 1) !== 1) {
         return;
      }

      const newFruit = {
          r: 7,
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
      if(this.state.fruits.length < 3 || Math.floor((Math.random() * 30) + 1) !== 1) {
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

    showNewBombs = () => {
        if(this.state.bombs.length > 1 || Math.floor((Math.random() * 60) + 1) !== 1) {
            return;
        }

        const newBomb = {
            r: 8,
            cx: 10 * Math.floor((Math.random() * 30) + 1),
            cy: 10 * Math.floor((Math.random() * 30) + 1),
        }

        let bombs = this.state.bombs.slice();
        bombs.push(newBomb);

        const newState = {
            ...this.state,
            bombs: bombs,
        };
        this.setState(newState);
        return;
    }

    hideRottenBombs = () => {
        if(this.state.bombs.length === 1 || Math.floor((Math.random() * 30) + 1) !== 1) {
            return;
        }

        let bombs = this.state.bombs.slice();

        bombs.shift();

        const newState = {
            ...this.state,
            bombs: bombs,
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
      return true;
    }))

      const newState = {
          ...this.state,
          fruits: fruits,
          growth: growth,
      };
      this.setState(newState);
      return;
  }

    eatBombs = () => {
        const snakeHead = this.state.snakeSegments[0];

        this.state.bombs.map(((bomb, index) => {
            if(this.doItemsCollide(snakeHead, bomb)) {
                this.gameOver();
            }
            return true;
        }))
    }

  setDirection = (x, y)  => {

    // don't go backwards
    if(this.state.direction.x * x || this.state.direction.y * y) {
        return;
    }

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
    const minRequiredDistance = a.r + b.r;
    return Math.abs(a.cx - b.cx) < minRequiredDistance
      && Math.abs(a.cy - b.cy) < minRequiredDistance;
  }

  tick = () => {
    // console.log('tick');
    this.dieIfCollide();
    if (this.state.paused) {
        return;
    }
    this.eatBombs();
    this.eatFruits();
    this.moveSnake();
    this.showNewFruits();
    this.hideRottenFruits();
    this.showNewBombs();
    this.hideRottenBombs();
   }

   restart = () => {
       if(this.state.gameOver) {
           this.setState(this.defaultState);
           this.start();
       }
   }

   togglePause = ()  => {

      if(this.state.gameOver) {
          return;
      }

       if(this.state.paused) {
         this.start();
       } else {
         this.pause();
       }
   }

   pause = ()  => {
       clearInterval(this.gameInterval);
       const newState = {
           ...this.state,
           paused: true,
       };
       this.setState(newState);
   }

   start = ()  => {
       this.gameInterval = setInterval(this.tick, this.props.speed);
       const newState = {
           ...this.state,
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
            // spacebar
            if (e.keyCode === 32) {
              this.togglePause();
            }
            // enter
            if (e.keyCode === 13) {
                this.restart();
            }
        });
        this.start();
    }

  renderGameOver() {
      if(this.state.gameOver) {
          return (<div className='game-over'><p>Game over.<br/> Press 'enter' to continue.</p></div>);
      }
  }

  render() {
    return (
      <div className="App">
        <div className="board">
            {this.renderGameOver()}
          <svg height={this.props.boardHeight} width={this.props.boardWidth}>
            <Snake snakeSegments={this.state.snakeSegments}/>
              {
                  this.state.fruits.map((fruit, index) => {
                      return (
                          <Fruit key={index} cx={fruit.cx} cy={fruit.cy} r={fruit.r} />
                      )
                  })
              }
              {
                  this.state.bombs.map((bomb, index) => {
                      return (
                          <Bomb key={index} cx={bomb.cx} cy={bomb.cy} r={bomb.r} />
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
