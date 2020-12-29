import React, { useState, useEffect } from 'react';
import { authService, dbService } from 'fBase';
import { useHistory } from 'react-router-dom';
import Nweet from 'components/Nweet';

export default ({userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState('');
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile();
        }
    }
    const getMyNewNweet = async () => {
        const newNweets = await dbService
            .collection('nweets')
            .where("creatorUser", "==", userObj.uid)
            .orderBy("createAt")
            .get();
        console.log(newNweets.docs.map((doc) => doc.data()));
    };
    useEffect(() => {
        getMyNewNweet();
    },[]);
    return (
        <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Your name" onChange={onChange} value={newDisplayName} />
            <input type="submit" value="Update Profile" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}