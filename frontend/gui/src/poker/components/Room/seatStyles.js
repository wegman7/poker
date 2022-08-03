import { makeStyles } from '@material-ui/core/styles';

const seatStyles = makeStyles((theme) => ({
  base: {
    position: 'absolute',
    fontSize: '1.3vw',
    width: '18%',
    height: '12%',
    backgroundColor: 'blue'
  },

  zero: {
    top: '0%', left: '60%'
  },
  one: {
    top: '0%', left: '85%'
  },
  two: {
    top: '49%', left: '87%'
  },
  three: {
    top: '80%', left: '68%'
  },
  four: {
    top: '88%', left: '44%'
  },
  five: {
    top: '80%', left: '19%'
  },
  six: {
    top: '49%', left: '0%'
  },
  seven: {
    top: '0%', left: '2%'
  },
  eight: {
    top: '0%', left: '30%'
  },

  chipsZero: {
    top: '10%', left: '60%'
  },
  chipsOne: {
    top: '0%', left: '85%'
  },
  chipsTwo: {
    top: '49%', left: '87%'
  },
  chipsThree: {
    top: '80%', left: '68%'
  },
  chipsFour: {
    top: '88%', left: '44%'
  },
  chipsFive: {
    top: '80%', left: '19%'
  },
  chipsSix: {
    top: '49%', left: '0%'
  },
  chipsSeven: {
    top: '0%', left: '2%'
  },
  chipsEight: {
    top: '10%', left: '30%'
  },

  buyin: {
    width: 225,
    height: 350,
    textAlign: 'center'
  },
  buyinButton: {
    margin: 10
  },
  buyinContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  buyinElement: {
    flexGrow: 1,
  },
}));

export default seatStyles;