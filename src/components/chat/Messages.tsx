'use client';
import { type Message as MessageType } from '@/db/schema';
import { CloudFog, Loader2, MessageSquare } from 'lucide-react';
import React, {
	use,
	useContext,
	useEffect,
	useRef,
	useState,
	type FC,
} from 'react';
import Message from './Message';
import type { ExtendedMessage } from '@/types/message';
import { ChatContext } from './context/ChatContext';
import Skeleton from 'react-loading-skeleton';
import { useIntersection } from '@mantine/hooks';
import axios from 'axios';
import { MessageHistory } from '@/helpers/query';

type NextPageInput = {
	setMessages: React.Dispatch<React.SetStateAction<ExtendedMessage[] | null>>;
	setCursor: React.Dispatch<React.SetStateAction<number | undefined>>;
	setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
	fileId: string;
	cursor?: number;
};

const fetchNextPage = async ({
	fileId,
	setCursor,
	setMessages,
	cursor,
	setIsPageLoading,
}: NextPageInput) => {
	if (!cursor) return;
	setIsPageLoading(true);
	const nextPageData = await axios.get<MessageHistory>(
		`/api/message/${fileId}`,
		{
			params: {
				cursor,
			},
		}
	);
	const { messages, nextCursor } = nextPageData.data;
	setCursor(nextCursor);
	setIsPageLoading(false);
	setMessages((pre) => [...(pre ?? []), ...messages]);
};

interface MessagesProps {
	fileId: string;
	history: MessageType[];
	initialNextCursor: number | undefined;
}
const Messages: FC<MessagesProps> = ({
	fileId,
	history,
	initialNextCursor,
}) => {
	const {
		isSending: isMessageSending,
		isLoading,
		messages,
		setMessages,
	} = useContext(ChatContext);
	const [nextCursor, setNextCursor] = useState<number | undefined>(
		initialNextCursor
	);
	const [isPageLoading, setIsPageLoading] = useState(false);
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
	};

	const combinedMessages: ExtendedMessage[] = [
		...(isMessageSending ? [loadingMessages] : []),
		...(messages ?? []),
	];

	const lastMessageRef = useRef<HTMLDivElement>(null);
	const { ref, entry } = useIntersection({
		root: lastMessageRef.current,
		threshold: 1,
	});
	useEffect(() => {
		setMessages(history);
	}, [history, setMessages]);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage({
				setMessages,
				setIsPageLoading,
				fileId,
				cursor: nextCursor,
				setCursor: setNextCursor,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [entry, fetchNextPage]);

	return (
		<div className="flex relative max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch">
			{combinedMessages.length > 0 ? (
				combinedMessages.map((message, index) => {
					const isNextMessageIsSamePerson =
						combinedMessages[index - 1]?.isUserMessage ===
						message.isUserMessage;

					if (index === combinedMessages.length - 1) {
						return (
							<Message
								ref={ref}
								message={message}
								isNextMessageIsSamePerson={isNextMessageIsSamePerson}
								key={message.id}
							/>
						);
					}

					return (
						<Message
							message={message}
							isNextMessageIsSamePerson={isNextMessageIsSamePerson}
							key={message.id}
						/>
					);
				})
			) : (
				<div className="flex-1 flex flex-col items-center justify-center gap-2">
					<MessageSquare className="h-8 w-8 text-primary" />
					<h3 className="font-semibold text-xl">You&apos;re all set!</h3>
					<p className="text-zinc-500 text-sm">
						Ask your first question to get started.
					</p>
				</div>
			)}
			{isPageLoading ? (
				<div className="cursor-pointer sticky z-50 top-1 left-1/2 -translate-x-1/2 flex max-w-fit items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-1  shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
					<Loader2 className="w-3 h-3 animate-spin" />
					<p className="text-sm font-semibold text-gray-700">Loading...</p>
				</div>
			) : null}
		</div>
	);
};

export default Messages;
