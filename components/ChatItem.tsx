import {Box, ButtonBase, Typography} from "@mui/material";

interface ChatItemProps {
    chat: {
        name: string;
        lastMessage: string;
    };
    onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({onClick, chat}) => {
    return (
        <ButtonBase onClick={onClick} sx={{width: 1, justifyContent: 'flex-start'}}>
            <Box sx={{mb: 2}}>
                <Typography variant="h6" gutterBottom  sx={{textAlign: 'left'}}>
                    {chat.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{textAlign: 'left'}}>
                    {chat.lastMessage}
                </Typography>
            </Box>
        </ButtonBase>
    );
};

export default ChatItem;
