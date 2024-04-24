'use client';
import { signOut } from 'next-auth/react';
import { useState, type FC, type PropsWithChildren } from 'react';

interface LogoutButtonProps extends PropsWithChildren {
  
}

const LogoutButton: FC<LogoutButtonProps> = ({children}) => {
 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onLogout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  }
  return (
		<button disabled={isLoading} onClick={onLogout} type="button">
			{children}
		</button>
	);
}

export default LogoutButton;