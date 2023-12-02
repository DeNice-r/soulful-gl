import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Grid, IconButton, Paper, TextField, Typography,} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Layout from "../../components/Layout";
import ChatItem from "../../components/ChatItem";
import { v4 as uuid } from "uuid";


const ChatUI = () => {
    const [messages, setMessages] = useState([{id: uuid(), text: "Доброго вечора ми з України", sender: "bot"}]);
    const [input, setInput] = React.useState("");
    const inputRef = React.useRef(null);
    const messageEndRef = React.useRef(null);

    const wsRef = React.useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket("ws://localhost:8000");
        wsRef.current.onopen = () => console.log("ws opened");
        wsRef.current.onclose = () => console.log("ws closed");
        wsRef.current.onerror = () => console.log("ws error");

        wsRef.current.onmessage = (event) => {
            let newMessage = {id: uuid(), text: event.data, sender: "bot"}
            console.log(newMessage);
            setMessages([...messages, newMessage]);
            setTimeout(() => {
                messageEndRef.current.scrollIntoView({behavior: "smooth", block: "center"});
            }, 0);
        }

        return () => {
            wsRef.current.close();
        }
    }, [])

    const chats = [
        {name: "Chat 1", lastMessage: "Last message 1"},
        {name: "Chat 2", lastMessage: "Last message 2"},
        {name: "Chat 3", lastMessage: "Last message 3"},
        {name: "Chat 4", lastMessage: "Last message 4"},
        {name: "Chat 5", lastMessage: "Last message 5"},
        {name: "Chat 6", lastMessage: "Last message 6"},
        {name: "Chat 7", lastMessage: "Last message 7"},
        {name: "Chat 8", lastMessage: "Last message 8"},
        {name: "Chat 9", lastMessage: "Last message 9"},
        {name: "Chat 10", lastMessage: "Last message 10"},
        {name: "Chat 11", lastMessage: "Last message 11"},
        {name: "Chat 12", lastMessage: "Last message 12"},
        {name: "Chat 13", lastMessage: "Last message 13"},
        {name: "Chat 14", lastMessage: "Last message 14"},
        {name: "Chat 15", lastMessage: "Last message 15"},
        {name: "Chat 16", lastMessage: "Last message 16"},
        {name: "Chat 17", lastMessage: "Last message 17"},
        {name: "Chat 18", lastMessage: "Last message 18"},
        {name: "Chat 19", lastMessage: "Last message 19"},
        {name: "Chat 20", lastMessage: "Last message 20"},
    ]

    const handleSend = () => {
        let message = inputRef.current.value
        if (message.trim() !== "") {
            const event = wsRef.current.send(message);
            let newMessage = {id: uuid(), text: message, sender: "user"}
            setMessages([...messages, newMessage]);
            inputRef.current.value = "";
        }
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
                            {messages.map((message) => (
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
    const isBot = message.sender === "bot";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isBot ? "flex-start" : "flex-end",
                mb: 2,
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    backgroundColor: isBot ? "primary.light" : "secondary.light",
                    color: isBot ? "primary.contrastText" : "secondary.contrastText",
                    borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                }}
            >
                <Typography variant="body1">{message.text}</Typography>
            </Paper>
        </Box>
    );
};

export default ChatUI;
