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
import { resetPassword } from '../../../utils/apiCalls';

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

const ResetPassword = (props) => {

  const classes = useStyles();
  const [inputs, setInputs] = useState({ password: '', loading: false });

  const url_params = new URLSearchParams(props.location.search);
  console.log(url_params.get("token_valid"));
  console.log(url_params.get("user"));
  console.log(url_params.get("token"));
  console.log(url_params.get("error"));

	if (url_params.get("token_valid") === 'false') {
		createNotification('error', url_params.get("error"));
		props.history.push('/login/');
	}

  const handleChange = (event) => {
      setInputs({
          ...inputs,
          [event.target.name]: event.target.value
      });
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    setInputs({ ...inputs, loading: true })
    
		resetPassword( inputs.password, url_params.get("token"), url_params.get("user"))
			.then(result => {
				console.log(result);
        createNotification('success', 'Successfully updated password.');
        setInputs({ ...inputs, loading: false });
        props.history.push('/login/');
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
          Reset password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New password"
            type="password"
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
            Reset
          </Button>
          <Grid container>
            <Grid item xs />
            <Grid item>
              <Link to='/login/' className={classes.link}>
                Back to login
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default ResetPassword;