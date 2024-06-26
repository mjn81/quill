import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetaData } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import 'simplebar-react/dist/simplebar.min.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en" className="light">
			<body
				className={cn(
					'min-h-screen font-sans antialiased grainy',
					inter.className
				)}
			>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
