import { FREE_PLAN_PAGE_NUM_SUPPORT } from ".";

export const PLANS = [
	{
		name: 'Free',
		slug: 'free',
		quota: 10,
		pagesPerPdf: FREE_PLAN_PAGE_NUM_SUPPORT,
		price: {
			amount: 0,
			priceIds: {
				test: '',
				production: '',
			},
		},
	},
	{
		name: 'Pro',
		slug: 'pro',
		quota: 100,
		pagesPerPdf: 25,
		price: {
			amount: 14,
			priceIds: {
				test: 'price_1P8HdhBu9P48ZioINoK6Ns9r',
				production: '',
			},
		},
	},
];
// 4 MB file size
export const FREE_UPLOAD_FILE_SIZE = 4_000_000;

// 100 MB
export const PAYED_UPLOAD_FILE_SIZE = 100_000_000;


export const BILLING_URL = '/dashboard/billing'