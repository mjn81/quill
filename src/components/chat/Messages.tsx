import { type Message } from '@/db/schema';
import { Loader2 } from 'lucide-react';
import { useState, type FC } from 'react';

interface MessagesProps {
  history: Message[];
  initialNextCursor: number | undefined;
}

const Messages: FC<MessagesProps> = ({history, initialNextCursor}) => {
  const [messages, setMessages] = useState<Message[]>(history);
  const [nextCursor, setNextCursor] = useState<number | undefined>(initialNextCursor);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingMessages = {
    createdAt: new Date(),
    id: -1,
    isUserMessage: false,
    content: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  }

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch">
      

    </div>
	);
}

export default Messages;