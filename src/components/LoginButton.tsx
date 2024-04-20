'use client';
import { useState, type FC } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginButtonProps {
  
}

export const LoginGoogleButton: FC<LoginButtonProps> = () => {
const [isLoading, setIsLoading] = useState<boolean>(false);
async function loginWithGoogle() {
	setIsLoading(true);
	try {
		await signIn('google');
	} catch (error) {
		console.log(error);
		toast.error('Something went wrong with your login.');
	} finally {
		setIsLoading(false);
	}
}
  return (
		<Button
			disabled={isLoading}
			onClick={loginWithGoogle}
			className="w-full bg-zinc-900 hover:bg-zinc-800"
			size="lg"
		>
			{isLoading ? (
				<Loader2 className="animate-spin mr-2" size={25} />
			) : (
				<Image
					src="/google.svg"
					height={20}
					width={20}
					alt="google_logo"
					className="mr-2"
				/>
			)}{' '}
			Sign in With Google
		</Button>
	);
}

export const LoginGithubButton: FC<LoginButtonProps> = () => {
const [isLoading, setIsLoading] = useState<boolean>(false);
async function loginWithGithub() {
	setIsLoading(true);
	try {
		await signIn('github');
	} catch (error) {
		console.log(error);
		toast.error('Something went wrong with your login.');
	} finally {
		setIsLoading(false);
	}
}
  return (
		<Button
			disabled={isLoading}
			onClick={loginWithGithub}
			className="w-full bg-zinc-900 hover:bg-zinc-800"
			size="lg"
		>
			{isLoading ? (
				<Loader2 className="animate-spin mr-2" size={25} />
			) : (
				<Image
					src="/github-mark-white.svg"
					height={20}
					width={20}
					alt="google_logo"
					className="mr-2"
				/>
			)}{' '}
			Sign in With Github
		</Button>
	);
}
