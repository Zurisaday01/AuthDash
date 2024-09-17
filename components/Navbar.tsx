import { getUser } from '@/actions/user.actions';
import Link from 'next/link';

import ClientNavbar from './ClientNavbar';

const Navbar = async () => {
	const user = await getUser();

	return (
		<nav className='border-b border-[#291750]/60 py-3'>
			<div className='flex items-center justify-between w-full '>
				<Link href='/dashboard' className='font-barlow text-2xl'>
					<span className='text-primary'>Auth</span>Dash
				</Link>
				{user && <ClientNavbar user={user as User} />}
			</div>
		</nav>
	);
};

export default Navbar;
