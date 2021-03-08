import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getRooms } from '../../../utils/apiCalls';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary,
    flexGrow: 1,
    display: 'inlineBlock',
  },
  container: {
    // backgroundColor: '#f5f5f5',
    padding: '10px',
  },
  center: {
    textAlign: 'center'
  },
  confirmBoxButtons: {
    margin: '5px',
  },
  userAvatar: {
    display: 'inlineBlock',
  },
  buttonBase: {
    // width: '100%'
  },
  tableRow: {
    '&:hover': {
      cursor: 'pointer',
    }
  },
  tableTitle: {
    fontWeight: 'bold'
  }
}));

const Rooms = (props) => {

  if (props.loadig) {
    return <CircularProgress />;
  }

  return (props.rooms.map((room) => (
    <TableRow className={props.tableRow} key={room.id} hover onClick={() => props.handleRoomClick(room.name)}>
      <TableCell component="th" scope="row">
        {room.name}
      </TableCell>
      <TableCell align="right">Stakes</TableCell>
      <TableCell align="right">Min buy-in</TableCell>
      {/* <TableCell align="right"><Button variant="contained">Join</Button></TableCell> */}
    </TableRow>
  )));
}

const UserAvatar = (props) => {
  return (
    <>
      <Box className={props.classes.userAvatar} mb={6} style={{ float: 'right' }}>
        <Paper elevation={3} style={{ width: '200px' }}>
        <Grid container spacing={0}>
          <Box p={2}>
            <Grid item xs={6}>
              <img src={props.avatarUrl} alt="" style={{ width: '65px', height: '65px' }} />
            </Grid>
          </Box>
          <Grid item xs={6}>
            <Box pt={3} pl={.5}>
              <Typography variant="h6">
                {props.username}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        </Paper>
      </Box>
    </>
  );
}

const Lobby = (props) => {

  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then(result => {
        console.log(result);
        setRooms(result.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleRoomClick = (name) => {
    props.setSelectedRoom(name);
    props.history.push('/room/');
  }

  return (
    <Box mx={8} mt={3}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.title} variant="h4" gutterBottom>
              Lobby
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <UserAvatar avatarUrl={props.user.avatarUrl} username={props.user.username} classes={classes} />
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle}>Name</TableCell>
                <TableCell className={classes.tableTitle} align="right">Stakes</TableCell>
                <TableCell className={classes.tableTitle} align="right">Min buy-in</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Rooms 
                rooms={rooms} 
                loading={loading} 
                handleRoomClick={handleRoomClick}
                buttonBase={classes.buttonBase} 
                tableRow={classes.tableRow} 
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default Lobby;
