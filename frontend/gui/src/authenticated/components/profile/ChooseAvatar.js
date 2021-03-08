import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import createNotification from '../../../utils/alerts';
import { getAvatars, changeAvatar } from '../../../utils/apiCalls';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: 'lightGrey',
      cursor: 'pointer',
      transition: theme.transitions.create('opacity'),
    },
  },
  container: {
    // backgroundColor: '#f5f5f5',
    padding: '30px',
  },
  button: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    // backgroundColor: 'purple'
  },
  focusVisible: {},
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: '100px 100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '100px',
    height: '100px',
    // backgroundColor: 'green'
  },
  buttonContainer: {
    position: 'relative', 
    width: '100%', 
    height: '140px', 
    // backgroundColor: 'red',
  },
  center: {
    textAlign: 'center'
  },
  confirmBoxButtons: {
    margin: '5px',
  }
}));

const ConfirmBox = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={() => props.handleClose(null)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">{"Update avatar?"}</DialogTitle>
      <DialogContent className={props.classes.center}>
        <img src={props.selectedAvatar.avatarUrl} alt="" style={{ width: '150px', height: '150px' }} />
      </DialogContent>
        <Box p={1}>
          <div className={props.classes.center}>
            <Button onClick={() => props.handleClose('confirm')} className={props.classes.confirmBoxButtons} variant="contained" color="primary" autoFocus>
              Confirm  
            </Button>
            <Button onClick={() => props.handleClose('cancel')} className={props.classes.confirmBoxButtons} variant="contained">
              Cancel
            </Button>
          </div>
        </Box>
    </Dialog>
  )
}

const Avatars = (props) => {
  return (props.avatars.map(avatar => (
    <Grid item xs={12} sm={4} md={3} lg={2} key={avatar.id}>
      <Paper className={props.classes.paper} elevation={3}>
        <div className={props.classes.buttonContainer}>
          <ButtonBase
            focusRipple
            key={avatar.id}
            className={props.classes.button}
            focusVisibleClassName={props.classes.focusVisible}
            onClick={() => props.onClick(avatar.id, avatar.image)}
          >
            <span
              className={props.classes.imageSrc}
              style={{
                backgroundImage: `url(${avatar.image})`,
              }}
            />
            <span className={props.classes.imageBackdrop} />
          </ButtonBase>
        </div>
      </Paper>
    </Grid>
  )));
}

const UserAvatar = (props) => {
  return (
    <>
      <Box mb={6} mt={6}>
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

const ChooseAvatar = (props) => {

  const classes = useStyles();
  const [data, setData] = useState({ avatars: null, loading: true });
  const [open, setOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState({ avatarId: null, avatarUrl: null });

  const handleClickOpen = (avatarId, avatarUrl) => {
    setSelectedAvatar({ avatarId: avatarId, avatarUrl: avatarUrl });
    setOpen(true);
  };

  const handleClose = (action) => {
    if (action === 'confirm') {
      changeAvatar(selectedAvatar.avatarId, selectedAvatar.avatarUrl)
        .then(result => {
          console.log(result);
          createNotification('success', 'Changed avatar.');
          props.setUser({ ...props.user, avatarUrl: selectedAvatar.avatarUrl });
        })
        .catch(error => {
          console.log(error);
          const messages = error.response.data;
          for (var message in messages) {
            createNotification('error', message + ': ' + String(messages[message]));
          }
        });
    }
    setOpen(false);
  };

  useEffect(() => {
    getAvatars()
      .then(response => {
        console.log(response);
        setData({ avatars: response.data, loading: false });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  if (data.loading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Box mx={8} mt={3}>
        <Container maxWidth="lg" className={classes.container}>
          <Typography variant="h4" gutterBottom className={classes.title}>
            Change avatar
          </Typography>
          <UserAvatar avatarUrl={props.user.avatarUrl} username={props.user.username} classes={classes} />
          <Grid container spacing={3}>
            <Avatars avatars={data.avatars} onClick={handleClickOpen} classes={classes} />
          </Grid>
        </Container>
      </Box>
      <ConfirmBox open={open} handleClose={handleClose} selectedAvatar={selectedAvatar} classes={classes} />
    </>
  );
}

export default ChooseAvatar;
