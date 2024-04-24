import { BILLING_URL, PLANS } from '@/constants/stripe';
import { db } from '@/db';
import { authOptions } from '@/lib/auth';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const dbUser = await db.query.users.findFirst({
		where: (user) => eq(user.id, session.user.id),
	});

	if (!dbUser) return new Response('Unauthorized', { status: 401 });


  const billingUrl = absoluteUrl(BILLING_URL, req.url);
  console.log(billingUrl)
	const subscriptionPlan = await getUserSubscriptionPlan();

  if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
			customer: dbUser.stripeCustomerId,
			return_url: billingUrl,
		});

    return Response.json({
      url: stripeSession.url,
    })
  }
  
  
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ['card', 'paypal'],
    mode: 'subscription',
    billing_address_collection: 'auto',
    line_items: [
      {
        price: PLANS.find(plan => plan.name === 'Pro')?.price.priceIds.test,
      quantity: 1,  
      }],
    metadata: {
      userId: session.user.id,
    }
  })

  return Response.json({
    url: stripeSession.url
  })

}
