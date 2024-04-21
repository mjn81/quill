'use client'
import axios, { AxiosError } from "axios";
import React, { type FC, type PropsWithChildren, createContext, useState } from "react";
import toast from "react-hot-toast";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleChangeInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export const ChatContext = createContext<StreamResponse>({
	message: '',
	addMessage: () => {},
	handleChangeInput: () => {},
	isLoading: false,
});

interface Props extends PropsWithChildren {
  fileId: string;
}

export const ChatContextProvider: FC<Props> = ({ children, fileId }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addMessage = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/message`, { message, fileId });
      
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        toast.error(error.response?.data);
        return;
      }

      toast.error('Something went wrong. Please try again later.');
    } finally {
			setIsLoading(false);
		}
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }
  return <ChatContext.Provider value={{
    addMessage,
    message,
    handleChangeInput,
    isLoading,
  }}>{children}</ChatContext.Provider>
}