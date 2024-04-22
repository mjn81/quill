'use client'
import { type Message as MessageType } from '@/db/schema';
import { Loader2, MessageSquare } from 'lucide-react';
import { use, useContext, useEffect, useState, type FC } from 'react';
import Message from './Message';
import type { ExtendedMessage } from '@/types/message';
import { ChatContext } from './context/ChatContext';
import Skeleton from 'react-loading-skeleton';

interface MessagesProps {
  history: MessageType[];
  initialNextCursor: number | undefined;
}

const Messages: FC<MessagesProps> = ({history, initialNextCursor}) => {
  const { isSending: isMessageSending, isLoading, messages, setMessages } = useContext(ChatContext);
  const [nextCursor, setNextCursor] = useState<number | undefined>(initialNextCursor);
  useEffect(() => {
    setMessages(history);
  }, [history, setMessages]);

  const loadingMessages: ExtendedMessage = {
    createdAt: new Date(),
    id: -1,
    isUserMessage: false,
    content: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ) as any,
    fileId: '',
    userId: '',
  }

  const combinedMessages: ExtendedMessage[] = [
    ...(isMessageSending ? [loadingMessages] : []),
    ...(messages ?? []),
    ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch">
      {combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          
          const isNextMessageIsSamePerson = combinedMessages[index - 1]?.isUserMessage === message.isUserMessage;
          
          if (index === combinedMessages.length - 1) {
            return <Message message={message} isNextMessageIsSamePerson={isNextMessageIsSamePerson} key={message.id} />
          }

          return <Message message={message} isNextMessageIsSamePerson={isNextMessageIsSamePerson} key={message.id} /> 
        })
      ) : isLoading ? (
        <div className='w-full flex flex-col gap-2'>
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
          <Skeleton className='h-16' />
        </div>
      ) : <div className='flex-1 flex flex-col items-center justify-center gap-2'>
            <MessageSquare className='h-8 w-8 text-primary' />
            <h3 className='font-semibold text-xl'>
              You&apos;re all set!
            </h3>
            <p className='text-zinc-500 text-sm'>
              Ask your first question to get started.
            </p>
      </div> }

    </div>
	);
}

export default Messages;