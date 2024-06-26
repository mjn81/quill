import type { FC } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';
import MobileNav from './MobileNav';

interface NavbarProps {
  
}

const Navbar: FC<NavbarProps> = async () => {
	const session = await getServerSession(authOptions);
	const user  = session?.user;
  return (
		<nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
			<MaxWidthWrapper>
				<div className="flex h-14 items-center justify-between border-b border-zinc-200">
					<Link href="/" className="flex z-40 font-semibold">
						<span>Quill.</span>
					</Link>

					<MobileNav isLoggedIn={!!user} />

					<div className="hidden items-center space-x-4 sm:flex">
						{!user ? (
							<>
								<Link
									href="/pricing"
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Pricing
								</Link>
								<Link
									href="/login"
									className={buttonVariants({
										size: 'sm',
									})}
								>
									Get started <ArrowRight className="ml-1.5 h-5 w-5" />
								</Link>
							</>
						) : (
							<>
								<UserAccountNav
									name={user.name ?? 'Your Account'}
									email={user.email}
									imageUrl={user.image}
								/>
							</>
						)}
					</div>
				</div>
			</MaxWidthWrapper>
		</nav>
	);
}

export default Navbar;