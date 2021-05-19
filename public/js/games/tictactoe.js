// const Tictactoe = () => {
//   const [liked, setLiked] = useState(false);
//   if (liked) {
//     return "You liked this.";
//   }
//   return  e(
//     'button',
//     { onClick: () => setLiked(true) },
//     'Like'
//   );
// }

class Tictactoe extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    // return e(
    //   'button',
    //   { onClick: () => this.setState({ liked: true }) },
    //   'Like'
    // );

    return(<button onClick={() => this.setState({ liked: true })}> Like </button>);
  }
}

