import BillingForm from '@/components/BillingForm';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import type { FC } from 'react';

interface BillingProps {
  
}

const Billing: FC<BillingProps> = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return <BillingForm subscriptionPlan={subscriptionPlan} />;
}

export default Billing;