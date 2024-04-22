import { type Message } from "@/db/schema";
import { cn } from "@/lib/utils";
import { FC, forwardRef } from "react";
import { Icons } from "../Icons";
import ReactMarkdown from 'react-markdown';
import { formatDate } from "date-fns";
import type { ExtendedMessage } from "@/types/message";

interface MessageProps {
  message: ExtendedMessage,
  isNextMessageIsSamePerson: boolean,
}

const Message= forwardRef<HTMLDivElement, MessageProps>(
	({ message, isNextMessageIsSamePerson }, ref) => {
		return (
      <div
        ref={ref}
				className={cn('flex items-end', {
					'justify-end': message.isUserMessage,
				})}
			>
				<div
					className={cn(
						'relative flex h-6 w-6 aspect-square items-center justify-center',
						{
							'order-2 bg-primary rounded-sm': message.isUserMessage,
							'order-1 bg-zinc-800 rounded-sm': !message.isUserMessage,
							invisible: isNextMessageIsSamePerson,
						}
					)}
				>
					{message.isUserMessage ? (
						<Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
					) : (
						<Icons.logo className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
					)}
				</div>

				<div
					className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
						'order-1 items-end': message.isUserMessage,
						'order-2 items-start': !message.isUserMessage,
					})}
				>
					<div
						className={cn('px-2 py-2 rounded-lg inline-block', {
							'bg-primary text-white': message.isUserMessage,
							'bg-gray-200 text-gray-900': !message.isUserMessage,
							'rounded-br-none':
								!isNextMessageIsSamePerson && message.isUserMessage,
							'rounded-bl-none':
								!isNextMessageIsSamePerson && !message.isUserMessage,
						})}
					>
						{typeof message.content === 'string' ? (
							<ReactMarkdown
								className={cn('prose', {
									'text-zinc-50': message.isUserMessage,
								})}
							>
								{message.content}
							</ReactMarkdown>
						) : (
							message.content
						)}

						{message.id !== -1 ? (
							<div
								className={cn('text-xs select-none mt-0.5 w-full text-right', {
									'text-zinc-500': !message.isUserMessage,
									'text-blue-300': message.isUserMessage,
								})}
							>
								{formatDate(message.createdAt, 'HH:mm')}
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}
);


Message.displayName = 'Message';

export default Message;