'use client'
import { ExtendedMessage } from "@/types/message";
import { AxiosError } from "axios";
import React, { type FC, type PropsWithChildren, createContext, useState, useRef } from "react";
import toast from "react-hot-toast";

type StreamResponse = {
  messages: ExtendedMessage[] | null;
  setMessages: React.Dispatch<React.SetStateAction<ExtendedMessage[] | null>>;
  addMessage: () => void;
  message: string;
  handleChangeInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isSending: boolean;
  backupMessage: React.MutableRefObject<string> | null;
  isLoading: boolean;
}

export const ChatContext = createContext<StreamResponse>({
  messages: null,
  setMessages: () => {},
	message: '',
	addMessage: () => {},
	handleChangeInput: () => {},
  isSending: false,
  backupMessage: null,
  isLoading: true,
});

interface Props extends PropsWithChildren {
  fileId: string;
}

export const ChatContextProvider: FC<Props> = ({ children, fileId }) => {
  const [messages, setMessages] = useState<ExtendedMessage[] | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const backupMessage = useRef('');
  const isLoading = messages === null;
  const addMessage = async () => {
    setIsSending(true);
    const tempId = Date.now();
    try {
      backupMessage.current = message;
      setMessage('');
      setMessages((prev) => [
        {
          id: tempId,
          content: message,
          createdAt: new Date(),
          isUserMessage: true,
          fileId: '',
          userId: '',
        },
        ...(prev ?? []),
      ]);
      
      // AI response in stream type using fetch api
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, fileId }),
      });
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response body');
      }
      const decoder = new TextDecoder();
      let accResponse = '';
      let done = false;
      const aiTempId = Date.now();
      setIsSending(false);
      // create empty message for AI response
      setMessages((prev) => [
        {
          id: aiTempId,
          content: '',
          createdAt: new Date(),
          isUserMessage: false,
          fileId: '',
          userId: '',
        },
        ...(prev ?? []),
      ]);
      while (!done) {
				const { value, done: doneValue } = await reader.read();
        done = doneValue;
        const chuck = decoder.decode(value, {
          stream: !done,
        });
        accResponse += chuck; 
        // reformat and fix response
        accResponse = accResponse
					.replace(/\d+:"(.*?)"\s*/g, '$1')
					.replace(/\\n/g, '\n');
      	setMessages(
					(prev) =>
						prev?.map((msg) => {
							if (msg.id === aiTempId) {
								return {
									...msg,
									content: accResponse,
								};
							}
							return msg;
						}) ?? []
				);
			}
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        toast.error(error.response?.data);
        return;
      }
      setMessages((prev) => prev?.filter((msg) => msg.id !== tempId) ?? []);
      setMessage(backupMessage.current);
      backupMessage.current = '';
      toast.error('Something went wrong. Please try again later.');
    } finally {
			setIsSending(false);
    } 
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }
  return <ChatContext.Provider value={{
    isLoading,
    messages,
    setMessages,
    addMessage,
    message,
    handleChangeInput,
    isSending,
    backupMessage,
  }}>{children}</ChatContext.Provider>
}