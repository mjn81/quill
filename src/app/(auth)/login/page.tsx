import {LoginGithubButton, LoginGoogleButton} from '@/components/LoginButton';

import type { FC } from 'react';

interface LoginProps {
  
}

const Login: FC<LoginProps> = () => {
  return (
		<div className="flex items-center justify-center bg-white w-screen h-[calc(100vh-3.5rem)]">
			<div className="h-full hidden lg:block lg:w-2/5 bg-accent shadow-inner">
				{/* fill this area with something!! */}
			</div>
			<div className="flex flex-col items-center p-4 lg:items-start lg:px-36 xl:px-52 gap-2 w-4/5 lg:w-3/5">
				<h1 className="text-3xl font-semibold text-primary">
					Welcome Back!
				</h1>
				<h3 className="text-lg font-medium text-secondary-foreground">
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