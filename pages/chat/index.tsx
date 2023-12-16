import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Grid, IconButton, Paper, TextField, Typography,} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Layout from "../../components/Layout";
import ChatItem from "../../components/ChatItem";
import {v4 as uuid} from "uuid";

const ChatUI = () => {
    const [messages, setMessages] = useState(0);
    const [input, setInput] = React.useState("");
    const inputRef = React.useRef(null);
    const messageEndRef = React.useRef(null);

    const wsRef = React.useRef(null);

    const messagesRef = React.useRef([]);

    function pushMessage(text, isRemote = false) {
        console.log("new message", text, isRemote);
        const message = {id: uuid(), text: text, isRemote};
        messagesRef.current.push(message);
        setMessages(messagesRef.current.length);
        setTimeout(() => {
            messageEndRef.current.scrollIntoView({behavior: "smooth", block: "center"});
        }, 0);
    }


    useEffect(() => {
        wsRef.current = new WebSocket("wss://unapi.pp.ua/ws");
        wsRef.current.onopen = () => console.log("ws opened");
        wsRef.current.onclose = () => console.log("ws closed");
        wsRef.current.onerror = () => console.log("ws error");

        wsRef.current.onmessage = (event) => {
            pushMessage(event.data, true);
        }

        return () => {
            wsRef.current.close();
        }
    }, [])

    let chats = []

    for (let i = 0; i < 20; i++) {
        chats.push({name: "Chat " + i, lastMessage: "Last message " + i})
    }

    const handleSend = () => {
        let message = inputRef.current.value
        if (message.trim() !== "") {
            wsRef.current.send(message);
            pushMessage(message);
        }
        inputRef.current.value = "";
        inputRef.current.focus();
        setTimeout(() => {
            messageEndRef.current.scrollIntoView({behavior: "smooth", block: "center"});
        }, 0);
    };

    return (
        <Layout>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <Box
                        sx={{
                            height: "89vh",
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "grey.300",
                        }}
                    >
                        <Box sx={{flexGrow: 1, overflow: "auto", p: 2}}>
                            {chats.map((chat) => (
                                <ChatItem key={chat.name} chat={chat} onClick={() => console.log(chat.name)}/>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={10}>
                    <Box
                        sx={{
                            height: "89vh",
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "grey.400",
                        }}
                    >
                        <Box sx={{flexGrow: 1, overflow: "auto", p: 2}}>
                            {messagesRef.current.map((message) => (
                                <Message key={message.id} message={message}/>
                            ))}
                            <div ref={messageEndRef}></div>
                        </Box>
                        <Box sx={{p: 0.5, backgroundColor: "grey.300"}}>
                            <Grid container spacing={1}>
                                <Grid item xs={11.5}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Type a message"
                                        variant="outlined"
                                        inputRef={inputRef}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                handleSend();
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={0.3}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={handleSend}
                                    >
                                        <SendIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Layout>
    );
};

const Message = ({message}) => {
    const isRemote = message.isRemote;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isRemote ? "flex-start" : "flex-end",
                mb: 2,
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    backgroundColor: isRemote ? "primary.light" : "secondary.light",
                    color: isRemote ? "primary.contrastText" : "secondary.contrastText",
                    borderRadius: isRemote ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                }}
            >
                <Typography variant="body1">{message.text}</Typography>
            </Paper>
        </Box>
    );
};

export default ChatUI;
