import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from './lib/redis';

// Rate limiting
const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	points: 10, // 10 points
	duration: 1, // Per second
});

export default withAuth(
	async function middleware(req) {
		const remoteAddress = req.ip || req.headers.get('x-forwarded-for') || '';
		// Rate limiting
		try {
			await rateLimiter.consume(remoteAddress);
		} catch (rejRes) {
			return new NextResponse('Too many requests', { status: 429 });
		}

		const pathname = req.nextUrl.pathname;

		const isAuth = await getToken({ req });
		const isLoginPage = pathname.startsWith('/login');
		const sensitiveRoutes = ['/dashboard'];

		const isAccessSensitiveRoute = sensitiveRoutes.some((route) =>
			pathname.startsWith(route)
		);
		if (isLoginPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL('/dashboard', req.url));
			}

			return NextResponse.next();
		}

		if (!isAuth && isAccessSensitiveRoute) {
			return NextResponse.redirect(new URL('/login', req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			async authorized() {
				return true;
			},
		},
	}
);

export const config = {
	matcher: ['/login', '/dashboard/:path*'],
};
