import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UpgradeButton from '@/components/UpgradeButton';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PLANS } from '@/constants/stripe';
import { authOptions } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

interface PricingProps {}

const pricingItems = [
	{
		plan: 'Free',
		tagline: 'For small side projects.',
		quota: 10,
		features: [
			{
				text: '15 pages per PDF',
				footnote: 'The maximum amount of pages per PDF-file.',
			},
			{
				text: '4MB file size limit',
				footnote: 'The maximum file size of a single PDF file.',
			},
			{
				text: 'Mobile-friendly interface',
			},
			{
				text: 'Higher-quality responses',
				footnote: 'Better algorithmic responses for enhanced content quality',
				negative: true,
			},
			{
				text: 'Priority support',
				negative: true,
			},
		],
	},
	{
		plan: 'Pro',
		tagline: 'For larger projects with higher needs.',
		quota: PLANS.find((p) => p.slug === 'pro')!.quota,
		features: [
			{
				text: '25 pages per PDF',
				footnote: 'The maximum amount of pages per PDF-file.',
			},
			{
				text: '16MB file size limit',
				footnote: 'The maximum file size of a single PDF file.',
			},
			{
				text: 'Mobile-friendly interface',
			},
			{
				text: 'Higher-quality responses',
				footnote: 'Better algorithmic responses for enhanced content quality',
			},
			{
				text: 'Priority support',
			},
		],
	},
];

const Pricing: FC<PricingProps> = async () => {
	const session = await getServerSession(authOptions);
  const user = session?.user;

	return (
    <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
      <div className='mx-auto mb-10 sm:max-w-lg'>
      <h1 className='text-6xl font-bold sm:text-7xl'>Pricing</h1>
        <p className='mt-5 text-gray-600 sm:text-lg'>
          Wether you&apos;re just trying out our service
          or need more, we&apos;ve got you covered.
      </p>
      </div>

      <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
        <TooltipProvider>
          {
            pricingItems.map(({ plan, quota, features, tagline }) => {
              const price = PLANS.find(p => p.slug === plan.toLowerCase())?.price.amount ?? 0;
              const isPro = plan === 'Pro';
              const isFree = plan === 'Free';
              return (
								<div
									key={plan}
									className={cn('relative rounded-2xl bg-white shadow-lg', {
										'border-2 border-primary shadow-blue-200': isPro,
										'border border-gray-200': !isPro,
									})}
								>
									{isPro && (
										<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-cyan-600 px-3 py-2 text-sm font-medium text-white">
											Upgrade now
										</div>
									)}
									<div className="p-5">
										<h3 className="my-3 text-center font-display text-3xl font-bold">
											{plan}
										</h3>
										<p className="text-gray-500">{tagline}</p>
										<p className="my-5 font-display text-6xl font-semibold">
											${price}
										</p>
										<p className="text-gray-500">per month</p>
									</div>

									<div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
										<div className="flex items-center space-x-1">
											<p>{quota.toLocaleString()} PDF/mo included</p>
											<Tooltip delayDuration={300}>
												<TooltipTrigger className="cursor-default ml-1.5">
													<HelpCircle className="w-4 h-4 text-zinc-500" />
												</TooltipTrigger>
												<TooltipContent className="w-80 p-2">
													How many PDFs you can upload per month.
												</TooltipContent>
											</Tooltip>
										</div>
									</div>

									<ul className="my-10 space-y-5 px-8">
										{features.map(({ text, footnote, negative }) => (
											<li key={text} className="flex space-x-5">
												<div className="flex-shrink-0">
													{negative ? (
														<Minus className="h-6 w-6 text-gray-300" />
													) : (
														<Check className="h-6 w-6 text-primary" />
													)}
												</div>
												{footnote ? (
													<div className="flex items-center space-x-1">
														<p
															className={cn('text-gray-400', {
																'text-gray-600': negative,
															})}
														>
															{text}
														</p>
														<Tooltip delayDuration={300}>
															<TooltipTrigger className="cursor-default ml-1.5">
																<HelpCircle className="w-4 h-4 text-zinc-500" />
															</TooltipTrigger>
															<TooltipContent className="w-80 p-2">
																{footnote}
															</TooltipContent>
														</Tooltip>
													</div>
												) : (
													<p
														className={cn('text-gray-400', {
															'text-gray-600': negative,
														})}
													>
														{text}
													</p>
												)}
											</li>
										))}
									</ul>
									<div className="border-t border-gray-200" />
									<div className="p-5">
										{isFree ? (
											<Link
												href={user ? '/dashboard' : 'login'}
												className={buttonVariants({
                          className: 'w-full',
                          variant: 'secondary',
												})}
											>
												{user ? 'Upgrade now' : 'sign up'}
												<ArrowRight className="w-5 h-5 ml-1.5" />
											</Link>
										) : user ? (
											<UpgradeButton />
										) : (
											<Link
												href="/login"
												className={buttonVariants({
													className: 'w-full',
												})}
											>
												{user ? 'Upgrade now' : 'sign up'}
												<ArrowRight className="w-5 h-5 ml-1.5" />
											</Link>
										)}
									</div>
								</div>
							);})
          }
          </TooltipProvider>
      </div>
    </MaxWidthWrapper>
	);
};

export default Pricing;
