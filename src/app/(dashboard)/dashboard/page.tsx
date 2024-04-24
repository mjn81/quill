import UploadButton from '@/components/UploadButton';
import { getUserFiles } from '@/helpers/query';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import FilesList from '@/components/FilesList';
import { getUserSubscriptionPlan } from '@/lib/stripe';


interface DashboardProps {
  
}

const Dashboard: FC<DashboardProps> = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();


	const subscription = await getUserSubscriptionPlan();
  const userFiles = (await getUserFiles(session.user.id)).sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	);
  return (
		<main className="mx-auto max-w-7xl md:p-10">
			<div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
				<h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
				<UploadButton isSubscribed={subscription.isSubscribed} />
			</div>

			<FilesList initialFiles={userFiles} />
		</main>
	);
}

export default Dashboard;