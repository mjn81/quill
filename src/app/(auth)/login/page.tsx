import { LoginGithubButton, LoginGoogleButton } from '@/components/LoginButton';
import Image from 'next/image';

import type { FC } from 'react';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
	return (
		<div className="flex items-center justify-center bg-white w-screen h-[calc(100vh-3.5rem)]">
			<div aria-hidden className="relative login-bg-image overflow-hidden h-full hidden lg:block lg:w-2/5 bg-accent shadow-inner">
				<div className="absolute z-10 w-full h-full bg-black/60"></div>
				<div className="absolute z-20 bottom-4 left-4 pr-4 space-y-1">
					<h3 className="  text-3xl font-semibold text-white">
						Let&apos;s get you started!
					</h3>
					<p className="leading-tight max-w-2/5 text-white">
						if you don&apos;t have an account, don&apos;t worry just click one
						of the options and we get you up and running in no time.
					</p>
				</div>
			</div>
			<div className="flex flex-col items-center p-4 lg:items-start lg:px-36 xl:px-52 gap-2 w-4/5 lg:w-3/5">
				<h1 className="text-3xl font-semibold text-primary">Welcome Back!</h1>
				<h3 className="text-lg font-medium text-secondary-foreground">
					Sign in to continue
				</h3>
				<div className="mt-5 w-full space-y-3">
					<LoginGoogleButton />
					<LoginGithubButton />
				</div>
			</div>
		</div>
	);
};

export default Login;
