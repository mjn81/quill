import { CREATOR_INFO } from "@/constants";
import clsx, { ClassValue } from "clsx";
import { Metadata } from "next";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export const createFileUrl = (fileId: string) => `/api/file/${fileId}`

export const absoluteUrl = (uri: string, current: string) => {
	const base = new URL(current, 'http://localhost:3000').origin;
	return new URL(uri, base).toString();
}

export const constructMetaData = ({
	title = 'Quill - The SaaS for students and scholars',
	description = 'Quill is an open-source software to make chatting with your PDF file easy.',
	image = '/thumbnail.png',
	icons = '/favicon.ico',
	noIndex = false,
}: MetadataConstructor = {}): Metadata => {
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: image,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [image],
			creator: CREATOR_INFO.twitter,
		},
		icons,
		metadataBase: new URL(process.env.BASE_DOMAIN!),
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
};