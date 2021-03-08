import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import logo from '../../assets/black.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  link: {
    textDecoration: 'none', 
    color: 'white',
  },
  logo: {
    height: '30px', 
    width: '30px',
  },
  logoButton: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(0),
    backgroundColor: 'transparent !important',
  }
}));

const MenuList = (props) => {

  return (
    <div
      className={props.classes.list}
      role="presentation"
      onClick={props.toggleDrawer('left', false)}
      onKeyDown={props.toggleDrawer('left', false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

const Navbar = (props) => {

  const classes = useStyles();
  const [state, setState] = useState({ left: false });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, left: open });
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={toggleDrawer('left', true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <IconButton className={classes.logoButton}>
              <Link to='/'><img src={logo} className={classes.logo} alt="" /></Link>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link className={classes.link} to='/' >Home</Link>
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}><Link to='/choose-avatar/' className={classes.link} style={{ color: 'black' }}>Change avatar</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link to='/change-password/' className={classes.link} style={{ color: 'black' }}>Change password</Link></MenuItem>
                <MenuItem onClick={() => { handleClose(); props.handleLogout(); }}>Logout</MenuItem>
              </Menu>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
        <MenuList classes={classes} toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
}

export default Navbar;