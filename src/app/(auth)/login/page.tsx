import {LoginGithubButton, LoginGoogleButton} from '@/components/LoginButton';

import type { FC } from 'react';

interface LoginProps {
  
}

const Login: FC<LoginProps> = () => {
  return (
		<div className="flex items-center justify-center bg-white w-screen h-[calc(100vh-3.5rem)]">
			<div className=" h-full hidden md:block md:w-2/5 3xl:w-3/5 bg-accent shadow-inner"></div>
			<div className="flex flex-col items-center p-4 lg:items-start lg:px-52 gap-2 w-4/5 md:w-3/5 3xl:w-2/5">
				<h1 className="text-xl sm:text-3xl font-semibold text-primary">
					Welcome Back!
				</h1>
				<h3 className="text-sm sm:text-lg font-medium text-secondary-foreground">
					Sign in to continue
        </h3>
        <div className='mt-5 w-full space-y-3'>
          <LoginGoogleButton />
          <LoginGithubButton />
        </div>
			
			</div>
		</div>
	);
}

export default Login;