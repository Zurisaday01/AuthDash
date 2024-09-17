import LoginForm from '@/components/forms/LoginForm';
import Link from 'next/link';

const page = () => {
	return (
		<div className='flex flex-col w-full justify-center items-center '>
			<header className='flex flex-col gap-2 mb-12 text-center'>
				<h1 className='font-barlow text-5xl text-center'>Log In</h1>
				<p>
					Don&apos;t have an account?{' '}
					<Link href='/register' className='text-purple-300'>
						Register
					</Link>
				</p>
			</header>
			<LoginForm />
		</div>
	);
};
export default page;
