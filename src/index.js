import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Declaracion de componente como clase
// class Square extends React.Component {
  
//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Declaracion de componente como funcion
function Square(props){
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      style={props.color}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        color={this.props.lineWinner && this.props.lineWinner.includes(i)? {'color' : '#008f39'} : {'color' : '#000000'}}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);

    this.state = this.jsonInicial();
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squareClickPosition: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickList: null
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      clickList: step
    });
  }

  orderList(){
    this.setState({
      orderList: this.state.orderList === 'asc' || this.state.orderList === null ? 'desc': 'asc'
    });
  }

  restartGame(){
    this.setState(this.jsonInicial());
  }

  jsonInicial(){
    return {
      history: [{
        squares: Array(9).fill(null),
        squareClickPosition: null
      }],
      xIsNext: true,
      stepNumber: 0,
      clickList: null,
      orderList: null
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const coorXY = ['(1,1)', '(2,1)', '(3,1)', '(1,2)', '(2,2)', '(3,2)', '(1,3)', '(2,3)', '(3,3)'];

    const moves = history.map((step, move) => {
      
      let desc = move ? `Go to move #${move}` : 'Go to game start';
      if(step.squareClickPosition != null) desc = `${desc}: CoorXY${coorXY[step.squareClickPosition]}`;

      return (
        <li key={move}>
          <button 
            style={this.state.clickList === move ? {'fontWeight': 'bold'} : {'fontWeight': 'normal'}} 
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {

      if(winner.winner === 'empate' ){
        status = 'This is a tie!';
      }else{
        status = 'Winner: ' + winner.winner;
      }

    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lineWinner={winner && winner.winner !== 'empate' ? winner.line : null}
          />
        </div>
        <div className="game-info">
          <div style={winner ? {'color' : '#008f39', 'fontWeight' : 'bold'} : {'color' : '#000000', 'fontWeight' : 'normal'}}>
            {status}
          </div>
          <ol>{this.state.orderList === 'asc' || this.state.orderList === null ? moves : moves.reverse()}</ol>
          <div>
            <button onClick={() => this.orderList()}>Orden Lista</button>
            <button onClick={() => this.restartGame()}>Reiniciar Juego</button>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }

  if (!squares.includes(null)){
    return {winner : 'empate'};
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);