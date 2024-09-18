import Image from 'next/image';
import '../globals.css';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='flex flex-col lg:flex-row w-full items-center p-5 justify-between gap-6 text-white bg-[#291750] h-[100vh]'>
			<div className='h-[95vh] w-1/2 rounded-md overflow-hidden shadow-xl hidden lg:block'>
				<Image
					className='object-cover w-full h-full'
					src='/login-registration.png'
					alt='Auth'
					width={1000}
					height={1000}
					priority
				/>
			</div>
			<div className='flex-1 w-full flex items-center justify-center h-full mt-18 lg:mt-0 '>
				{children}
			</div>
		</div>
	);
}
