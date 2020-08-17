import React, { Component } from 'react';
import axios from 'axios';

class ChooseAvatar extends Component {

    state = { myAvatarId: null, myAvatarUrl: null }

    componentDidMount() {
        axios.get('api/avatar/')
            .then(response => {
                const avatars = response.data;
                this.setState({ avatars: avatars });
                for (const avatar of avatars) {
                    this.setState({ [avatar.id]: avatar.image });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let avatar = this.state.myAvatarId;
        let avatarUrl = this.state.myAvatarUrl;
        console.log(avatar);
        if (!avatar) {
            alert('You must pick one!')
        } else {
            localStorage.setItem('avatar', avatarUrl);
            axios.get('/rest-auth/user/', {
                headers: {
                    Authorization: `Token ${this.props.token}`
                }
            })
            .then(response => {
                var userId = response.data.pk;
                axios.patch(`/api/contact/${userId}/`, {
                    avatar: avatar
                },
                {
                    headers: { Authorization: `Token ${this.props.token}` }
                }
                )
                .then(response => {
                    this.props.history.push('/');
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => console.log(error))
        }
    }

    handleChange = (avatarId) => {
         this.setState({ 
             myAvatarUrl: this.state[avatarId],
             myAvatarId: avatarId
          })
    }

    render() {
        if (!this.state.avatars) { return null; }
        return (
            <div>
                <div>
                    {
                        this.state.avatars.map(avatar => 
                            <label key={avatar.id}>
                                <input type="radio" name="test" value={this.state[avatar.id]} onChange={() => this.handleChange(avatar.id)} />
                                <img src={avatar.image} alt="alt" style={{ width: '300px', height: '300px' }} />
                            </label>)
                    }
                </div>
                <form onSubmit={this.handleSubmit}>
                    <img name="myAvatar" src={this.state.myAvatarUrl} alt='' />
                    <input type="submit" value="Confirm" />
                </form>
            </div>
        )
    }
}

export default ChooseAvatar;