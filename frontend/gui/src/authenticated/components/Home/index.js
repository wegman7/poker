import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const Home = (props) => {
	
	return (
		<>
			<Box p={10}>
				<Button onClick={() => { props.setUser({ ...props.user, play: true }); props.history.push('/'); }} variant="contained" color="secondary" size="large">
					Play poker!
				</Button>
			</Box>
		</>
	);
}

export default Home;
