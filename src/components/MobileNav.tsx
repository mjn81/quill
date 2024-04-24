'use client'
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';

interface MobileNavProps {
  isLoggedIn: boolean
}

const MobileNav: FC<MobileNavProps> = ({ isLoggedIn}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  }
  
  useEffect(() => {
    if (isOpen) toggleMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])


  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleMenu();
    }
  }

  return (
		<div className="sm:hidden">
			<Menu
				onClick={toggleMenu}
				className="relative z-50 h-5 w-5 text-zinc-700"
			/>
			{isOpen ? (
				<div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
					<ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
						{!isLoggedIn ? (
							<>
								<li onClick={() => closeOnCurrent('/login')}>
									<Link
										href="/login"
										className="flex items-center w-full font-semibold text-green-600"
									>
										Get started <ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</li>
								<li className="my-3 h-px w-full bg-gray-300" />
								<li onClick={() => closeOnCurrent('/pricing')}>
									<Link
										href="/pricing"
										className="flex items-center w-full font-semibold"
									>
										Pricing
										
									</Link>
								</li>
							</>
						) : (
							<>
								<li onClick={() => closeOnCurrent('/dashboard')}>
									<Link
										href="/dashboard"
										className="flex items-center w-full font-semibold text-green-600"
									>
										Dashboard 
									</Link>
								</li>
								<li className="my-3 h-px w-full bg-gray-300" />
								<li className='cursor-pointer' onClick={async () => await signOut()}>
									<div className="flex items-center w-full font-semibold">
										Log out
									</div>
								</li>
							</>
						)}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export default MobileNav;