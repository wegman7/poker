import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({

  appBar: {
    height: '100px',
    backgroundColor: 'grey',
  },
  navButtons: {
    height: '80px',
  },
  windowContainer: {
    flexGrow: 1
  },
  window: {
    // width: '175px',
    height: '100px',
    backgroundColor: 'green',
    // margin: '10px'
  }
}));

const Navbar = (props) => {

  const classes = useStyles();

  const onClickExit = () => {
    for (const socket in props.pokerSockets) {
      props.pokerSockets[socket].disconnect();
    }
    props.setUser({ ...props.user, play: false }); 
    props.history.push('/');
  }

  const onClickLobby = () => {
    props.setSelectedRoom('lobby');
    props.history.push('/lobby/');
  }

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Box p={2}>
          <Button className={classes.navButtons} onClick={onClickLobby} variant="contained">
            Lobby
          </Button>
        </Box>
        {/* WE'LL NEED A SECOND ROOM COMPONENT FOR THE THIS NAVBAR. IT WILL ONLY TAKE 
            GAMESTATE AS A PROP, AND WILL HAVE NO FUNCTIONALITY OTHER THAN DISPLAYING 
            THE STATE */}
        <Grid className={classes.left} container spacing={0}>
          <Grid className={classes.window} item xs={3}>
            test room
          </Grid>
          <Divider orientation="vertical" />
          <Grid item className={classes.window} xs={3}>
            test room
          </Grid>
          <Divider orientation="vertical" />
        </Grid>
        <Box p={2}>
          <Button 
            className={classes.navButtons} 
            onClick={onClickExit} 
            variant="contained"
          >
            Exit
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;
