import type { PropsWithChildren } from 'react';
import { FC } from 'react';

import { Toaster } from 'react-hot-toast';

interface ProvidersProps extends PropsWithChildren {}

const Providers: FC<ProvidersProps> = ({ children }) => {
	return (
		<>
			<Toaster
				containerClassName="text-sm"
				position="top-center"
				reverseOrder={false}
			/>
			{children}
		</>
	);
};

export default Providers;

