import type { Metadata } from 'next';
import { Montserrat, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const montserratSans = Montserrat({
	variable: '--font-montserrat',
	weight: ['300', '400'],
	subsets: ['latin'],
});
const barlowMono = Barlow_Condensed({
	variable: '--font-barlow',
	weight: ['500', '700'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'AuthDash',
	description: 'Dashboard for managing users',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${montserratSans.variable} ${barlowMono.variable} font-montserrat`}>
				<Toaster />
				<main>{children}</main>
			</body>
		</html>
	);
}
