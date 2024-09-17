import RegisterForm from '@/components/forms/RegisterForm';
import Link from 'next/link';

const page = () => {
	return (
		<div className='flex flex-col w-full justify-center items-center '>
			<header className='flex flex-col gap-2 mb-12 text-center'>
				<h1 className='font-barlow text-5xl text-center'>Create an account</h1>
				<p>
					Already have an account?{' '}
					<Link href='/login' className='text-purple-300'>
						Log In
					</Link>
				</p>
			</header>
			<RegisterForm />
		</div>
	);
};
export default page;
