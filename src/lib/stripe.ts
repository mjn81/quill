import { PLANS } from '@/constants/stripe';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import Stripe from 'stripe';
import { authOptions } from './auth';
import { eq } from 'drizzle-orm';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
	apiVersion: '2024-04-10',
	typescript: true,
});

export async function getUserSubscriptionPlan() {
  const session = await getServerSession(authOptions);
  if (!session) {
  return {
    ...PLANS[0],
    isSubscribed: false,
			isCanceled: false,
			stripeCurrentPeriodEnd: null,
		};
	}
  
	const dbUser = await db.query.users.findFirst({
		where: (user) => eq(user.id, session.user.id)
	});

	if (!dbUser) {
		return {
			...PLANS[0],
			isSubscribed: false,
			isCanceled: false,
			stripeCurrentPeriodEnd: null,
		};
	}

	const isSubscribed = Boolean(
		dbUser.stripePriceId &&
			dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
			dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
	);

	const plan = isSubscribed
		? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
		: null;

	let isCanceled = false;
	if (isSubscribed && dbUser.stripeSubscriptionId) {
		const stripePlan = await stripe.subscriptions.retrieve(
			dbUser.stripeSubscriptionId
		);
		isCanceled = stripePlan.cancel_at_period_end;
	}

	return {
		...plan,
		stripeSubscriptionId: dbUser.stripeSubscriptionId,
		stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
		stripeCustomerId: dbUser.stripeCustomerId,
		isSubscribed,
		isCanceled,
	};
}
