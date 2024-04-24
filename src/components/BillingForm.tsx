'use client'
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { useState, type FC } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { BILLING_URL } from '@/constants/stripe';
import { useRouter } from 'next/navigation';

interface BillingFormProps {
  subscriptionPlan: Awaited<
  ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm: FC<BillingFormProps> = ({subscriptionPlan}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createStripeSession = async () => {
    setIsLoading(true);
    const res = await axios.post<{ url: string }>('/api/billing');
		const url = res.data.url;
    setIsLoading(false);
		router.push(url ?? BILLING_URL);
  }
  
  return (
		<MaxWidthWrapper className="max-w-5xl">
			<form
				className="mt-12"
				onSubmit={async (e) => {
					e.preventDefault();
					await createStripeSession();
				}}
			>
				<Card>
					<CardHeader>
						<CardTitle>Subscription Plan</CardTitle>
						<CardDescription>
							You are currently on the <strong>{subscriptionPlan.name}</strong>
							plan.
						</CardDescription>
					</CardHeader>

					<CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
						<Button type="submit">
							{isLoading ? (
								<Loader2 className="mr-4 h-4 w-4 animate-spin" />
							) : null}
							{subscriptionPlan.isSubscribed
								? 'Manage Subscription'
								: 'Upgrading to PRO'}
						</Button>
						{subscriptionPlan.isSubscribed ? (
							<p className="rounded-full text-xs font-medium">
								{subscriptionPlan.isCanceled
									? 'Your plan will be canceled on '
									: 'Your plan renews on'}
								{format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
								.
							</p>
						) : null}
					</CardFooter>
				</Card>
			</form>
		</MaxWidthWrapper>
	);
}

export default BillingForm;