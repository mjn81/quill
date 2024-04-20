import ChatWrapper from '@/components/ChatWrapper';
import PDFRenderer from '@/components/PDFRenderer';
import {  getUserFileById } from '@/helpers/query';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

interface FileDetailProps {
  params: {
    fileId: string;
  }
}

const FileDetail: FC<FileDetailProps> = async ({ params: { fileId } }) => {
  
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userFile = await getUserFileById(fileId, session.user.id);

  if (!userFile) notFound();

  return (
		<div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
			<div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
				<div className="flex-1 xl:flex">
					<div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
						<PDFRenderer fileId={fileId} />
					</div>
				</div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          
          <ChatWrapper />
        </div>
			</div>
		</div>
	);
}

export default FileDetail;