import { db } from '@/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from 'next';
import { AuthOptions, DefaultSession, getServerSession } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Github from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { unstable_noStore } from 'next/cache';

const getGoogleCredentials = () => {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId || clientId.length === 0) {
		throw new Error('Google client id is not available');
	}

	if (!clientSecret || clientSecret.length === 0) {
		throw new Error('Google client secret is not available');
	}

	return {
		clientId,
		clientSecret,
	};
};
const getGithubCredentials = () => {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const clientSecret = process.env.GITHUB_CLIENT_SECRET;
	if (!clientId || clientId.length === 0) {
		throw new Error('Github client id is not available');
	}

	if (!clientSecret || clientSecret.length === 0) {
		throw new Error('Github client secret is not available');
	}

	return {
		clientId,
		clientSecret,
	};
};

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export const authOptions = {
	adapter: DrizzleAdapter(db) as Adapter,
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientId,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
		Github({
			clientId: getGithubCredentials().clientId,
			clientSecret: getGithubCredentials().clientSecret,
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUser = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, token.email!),
			});

			if (!dbUser) {
				throw new Error('no user with email found');
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		async session({ token, session }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}

			return session;
		},
		redirect() {
      return '/dashboard';
    }
	},
} satisfies AuthOptions;

// Use it in server contexts
export async function auth(
	...args:
		| [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
		| [NextApiRequest, NextApiResponse]
		| []
) {
	unstable_noStore();
	const session = await getServerSession(...args, authOptions);
	return { getUser: () => session?.user && { userId: session.user.id } };
}
