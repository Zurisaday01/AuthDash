import '../globals.css';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='max-w-[1470px] m-auto px-4'>
			<Navbar />
			<main className='max-w-[1470px] m-auto mt-10'>{children}</main>
		</div>
	);
}
