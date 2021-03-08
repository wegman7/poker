import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';

import createNotification from '../../../utils/alerts';
import { changePassword } from '../../../utils/apiCalls';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  test: {
      fontFamily: theme.typography.fontFamily
  },
  link: {
		textDecoration: 'none',
  },
}));

const ChangePassword = (props) => {

  const classes = useStyles();
  const [inputs, setInputs] = useState({ oldPassword: '', newPassword: '', loading: false });

  const handleChange = (event) => {
      setInputs({
          ...inputs,
          [event.target.name]: event.target.value
      });
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    setInputs({ ...inputs, loading: true })
    
		changePassword( inputs.oldPassword, inputs.newPassword )
			.then(result => {
				console.log(result);
        createNotification('success', 'Successfully updated password.');
        setInputs({ ...inputs, loading: false });
        props.history.push('/');
			})
			.catch(error => {
        console.log(error);
        const messages = error.response.data;
        for (var message in messages) {
          createNotification('error', message + ': ' + String(messages[message]));
        }
        setInputs({ ...inputs, loading: false });
			});
  }

  if (inputs.loading) {
		return (
			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<CssBaseline />
					<CircularProgress />
				</div>
			</Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="oldPassword"
            label="Current password"
            type="password"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Change
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link to='/' className={classes.link}>
                Home
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default ChangePassword;