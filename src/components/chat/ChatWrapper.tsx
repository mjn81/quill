import type { FC } from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { Message, type File } from '@/db/schema';
import { Loader2, XCircle } from 'lucide-react';
import { FREE_PLAN_PAGE_NUM_SUPPORT } from '@/constants';
import { ChatContextProvider } from './context/ChatContext';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getHistoryMessages } from '@/helpers/query';
import { notFound } from 'next/navigation';

interface ChatWrapperProps {
  file: File;
}

const ChatWrapper: FC<ChatWrapperProps> = async ({ file }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { messages: historyMessages,nextCursor } = await getHistoryMessages(file.id);

  if (file.uploadStatus === 'PROCESSING') {
    return <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
      <div className='flex-1 flex justify-center items-center flex-col mb-28'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <h3 className='font-semibold text-xl'>Processing...</h3>
          <p className='text-zinc-500 text-sm'>
            We&apos;re preparing your PDF. Please refresh the page after a while.
          </p>
        </div>
      </div>

      <ChatInput disabled />
    </div>
  }
  if (file.uploadStatus === 'FAILED') {
		return (
			<div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<XCircle className="h-8 w-8 text-red-500" />
						<h3 className="font-semibold text-xl">Too many pages in PDF</h3>
						<p className="text-zinc-500 text-sm">
							Your <span className="font-semibold">Free</span> plan supports up to{' '}
							{FREE_PLAN_PAGE_NUM_SUPPORT} pages per PDF.
						</p>
					</div>
				</div>

				<ChatInput disabled />
			</div>
		);
  }
  
  return (
		<ChatContextProvider fileId={file.id}>
			<div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-col justify-between gap-2">
				<div className="flex-1 justify-between flex flex-col">
					<Messages fileId={file.id} history={historyMessages} initialNextCursor={nextCursor} />
				</div>

				<ChatInput />
			</div>
		</ChatContextProvider>
	);
} 

export default ChatWrapper;