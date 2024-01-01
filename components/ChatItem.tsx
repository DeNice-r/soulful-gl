import {Box, ButtonBase, Typography} from "@mui/material";

interface ChatItemProps {
    chat: {
        id: number;
    };
    onClick: (e: React.SyntheticEvent) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({onClick, chat}) => {
    return (
        <ButtonBase onClick={onClick} sx={{width: 1, justifyContent: 'flex-start'}}>
            <Box sx={{mb: 2}}>
                <Typography variant="h6" gutterBottom  sx={{textAlign: 'left'}}>
                    Chat #{chat.id}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{textAlign: 'left'}}>
                    {/*{chat.lastMessage}*/}{chat?.messages?.length > 0 && chat.messages.slice(-1)[0].text}
                </Typography>
            </Box>
        </ButtonBase>
    );
};

export default ChatItem;
