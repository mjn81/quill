import { getUserSubscriptionPlan } from '@/lib/stripe';

import type { FC } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,DropdownMenuSeparator } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { Icons } from './Icons';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import LogoutButton from './LogoutButton';

interface UserAccountNavProps {
  email: string | null | undefined;
  imageUrl: string | null |  undefined;
  name: string ;
}

const UserAccountNav: FC<UserAccountNavProps> =  async ({imageUrl, name, email}) => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  
  
  return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="overflow-visible">
				<Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
					<Avatar className="relative w-8 h-8">
						{imageUrl ? (
							<div className="relative aspect-square h-full w-full">
								<Image
									fill
									src={imageUrl}
									alt="profile picture"
									referrerPolicy="no-referrer"
								/>
							</div>
						) : (
							<AvatarFallback>
								<span className="sr-only">{name}</span>
								<Icons.user className="w-4 h-4 text-zinc-900" />
							</AvatarFallback>
						)}
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="bg-white" align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-0.5 leading-none">
						{name && <p className="font-medium text-sm text-black">{name}</p>}
						{email && (
							<p className="w-[200px] truncate text-xs text-zinc-700">
								{email}
							</p>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer' asChild>
					<Link href="/dashboard">Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" asChild>
					{subscriptionPlan.isSubscribed ? (
						<Link href="/dashboard/billing">Manage subscription</Link>
					) : (
						<Link href="/pricing">
							Upgrade
							<Gem className="text-primary h-4 w-4 ml-1.5" />
						</Link>
					)}
				</DropdownMenuItem>
				<DropdownMenuItem  className="cursor-pointer">
          <LogoutButton>
            Log out
          </LogoutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserAccountNav;