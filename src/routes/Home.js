import React, {useState, useEffect} from 'react';
import { dbService, storageService } from 'fBase';
import Nweet from 'components/Nweet';
import { v4 as uuidv4 } from "uuid";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState();
    useEffect(() => {
        dbService.collection('nweets').onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
            setNweets(nweetArray)
        }) 
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = '';
        if(attachment!==''){
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await fileRef.putString(attachment, "data_url");
            attachmentUrl = await response.res.getDownloadURL();
        }
        const newNweet = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("nweets").add(newNweet);
        setNweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    }
    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const clearFile = () => {
        setAttachment(null);
    }
    return (<div>
    <form onSubmit={onSubmit}>
        <input type="text" placeholder="What's on your mind?" maxLength={120} value={nweet} onChange={onChange} />
        <input type="file"  accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
            <>
            <img 
                src={attachment} 
                width="50px"
                height="auto"
                alt={attachment}
            />
            <button onClick={clearFile}>Clear</button>
            </>
        )}
    </form>
    <div>
        {nweets.map((nweet) => (
            <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
        ))}
    </div>
    </div>)
};
export default Home;