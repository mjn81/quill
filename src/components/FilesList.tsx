'use client';

import { type File } from '@/db/schema';
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { useState, type FC } from 'react';
import { Button } from './ui/button';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface FilesListProps {
  initialFiles: File[]
}

const FilesList: FC<FilesListProps> = ({initialFiles}) => {
  const [files, setFiles] = useState(initialFiles);
	
	if (files.length === 0) {
		return (
			<div className="mt-16 flex flex-col items-center gap-2">
				<Ghost className="h-8 w-8 text-zinc-800" />
				<h3 className="font-semibold text-xl">Pretty empty around here!</h3>
				<p>Let&apos;s get started by uploading your first PDF.</p>
			</div>
		);
	}

  return (
		<ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
			{files.map((file) => (
				<li
					key={file.id}
					className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
				>
					<Link href={`dashboard/${file.id}`} className="flex flex-col gap-2">
						<div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
							<div className="h-10 w-10 flex flex-shrink-0  rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
							<div className="flex-1 truncate">
								<div className="flex items-center gap-3">
									<h3 className="truncate text-lg font-medium text-zinc-900">
										{file.name}
									</h3>
								</div>
							</div>
						</div>
					</Link>
					<div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
						<div className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							{format(file.createdAt, 'MMM yyyy')}
						</div>
						<div className="flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							mocked
						</div>


						<DeleteButton fileId={file.id} setFiles={setFiles} />
					
					</div>
				</li>
			))}
		</ul>
	);
}

interface DeleteButtonProps {
	fileId: string;
	setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const DeleteButton: FC<DeleteButtonProps> = ({ fileId, setFiles }) => {
	  const [isLoading, setIsLoading] = useState(false);
		const onClick = async () => {
			setIsLoading(true);
			try {
				const res = await axios.delete('/api/file', {
					data: { id: fileId },
				});
				if (res.status === 200) {
					setFiles((prevFiles) =>
						prevFiles.filter((file) => file.id !== fileId)
					);
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					toast.error(error.response?.data || 'An error occurred');
					return;
				}
			} finally {
				setIsLoading(false);
			}
		};
	
	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			size="sm"
			className="w-full"
			variant="destructive"
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Trash className="h-4 w-4" />
			)}
		</Button>
	);
}

export default FilesList;