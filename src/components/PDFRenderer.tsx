'use client';
import { cn, createFileUrl } from '@/lib/utils';
import { ChevronDown, ChevronUp, Loader2, RotateCcw, RotateCw, Search } from 'lucide-react';
import { useState, type FC } from 'react';
import toast from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import PdfFullScreen from './PdfFullScreen';
interface PDFRendererProps {
  fileId: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFRenderer: FC<PDFRendererProps> = ({ fileId }) => {
  
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const { width, ref } = useResizeDetector();
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [renderScale, setRenderScale] = useState<number | null>(null);
	const isLoading = renderScale !== scale;
  const pageNumValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });
  
  
  type TPageNumberValidator = z.infer<typeof pageNumValidator>;
  const { register, handleSubmit, formState: {errors}, setValue } = useForm<TPageNumberValidator>({
    defaultValues: {
      page: '1'
    },
    resolver: zodResolver(pageNumValidator)
  });

  const handlePageSubmit = ({page}: TPageNumberValidator) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  }
  
  return (
		<div className="w-full bg-white rounded-md shadow flex flex-col items-center">
			<div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
				<div className="flex items-center gap-1.5">
					<Button
						disabled={currentPage <= 1}
						onClick={() => {
							setCurrentPage((pre) => (pre - 1 > 1 ? pre - 1 : 1));
							setValue('page', String(currentPage - 1));
						}}
						variant="ghost"
						aria-label="previous page"
					>
						<ChevronDown className="h-4 w-4" />
					</Button>

					<div className="flex items-center gap-1.5">
						<Input
							{...register('page')}
							className={cn(
								'w-12 h-8',
								errors.page && 'focus-visible:ring-red-500'
							)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSubmit(handlePageSubmit)();
								}
							}}
						/>
						<p className="text-zinc-700 text-sm space-x-1">
							<span>/</span>
							<span>{numPages ?? 'x'}</span>
						</p>
					</div>
					<Button
						disabled={currentPage === numPages || numPages === undefined}
						onClick={() => {
							setCurrentPage((pre) =>
								pre + 1 < numPages! ? pre + 1 : numPages!
							);
							setValue('page', String(currentPage + 1));
						}}
						variant="ghost"
						aria-label="next page"
					>
						<ChevronUp className="h-4 w-4" />
					</Button>
				</div>

				<div className="space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button aria-label="zoom" variant="ghost">
								<Search className="w-4 h-4" />
								{scale * 100}% <ChevronDown className="w-3 h-3 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => setScale(1)}>
								100%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.5)}>
								150%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2)}>
								200%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.5)}>
								250%
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="ghost"
						aria-label="rotate 90 deg"
						onClick={() => setRotation((prev) => prev + 90)}
					>
						<RotateCw className="w-4 h-4" />
					</Button>

					<PdfFullScreen
						fileId={fileId}
						numPages={numPages}
					/>
				</div>
			</div>

			<div className="flex-1 w-full max-h-screen">
				<SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
					<div ref={ref}>
						<Document
							loading={
								<div className="flex justify-center">
									<Loader2 className="my-24 h-6 w-6 animate-spin" />
								</div>
							}
							onError={() => {
								toast.error('Error loading PDF. Please try again later.');
							}}
							onLoadSuccess={({ numPages }) => {
								setNumPages(numPages);
							}}
							file={createFileUrl(fileId)}
							className="max-h-full"
						>
							{isLoading&& renderScale ? <Page
								rotate={rotation}
								width={width ? width : 1}
								scale={scale}
								pageNumber={currentPage}
								key={"@" + renderScale}
							/> : null}
							<Page
								className={cn(isLoading ? 'hidden' : '')}
								pageNumber={currentPage}
								rotate={rotation}
								width={width}
								scale={scale}
								key={"@"+scale}
								loading={
									<div className='flex justify-center'>
										<Loader2 className='my-24 h-6 w-6 animate-spin' />
									</div>
								}


								onRenderSuccess={() => setRenderScale(scale)}
							/>
						</Document>
					</div>
				</SimpleBar>
			</div>
		</div>
	);
}

export default PDFRenderer;