'use client';

import { LogOut, User } from 'lucide-react';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from '@/components/ui/menubar';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/server';

const ClientNavbar = ({ user }: { user: User }) => {
	const router = useRouter();
	const handleLogOut = async () => {
		await logout();
		router.push('/login');
	};
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					<div className='flex items-center gap-2'>
						<div className='relative'>
							<div className='border-2 border-gray-400 rounded-full w-8 h-8 bg-gray-100 flex items-center justify-center'>
								<User className='w-8 text-gray-500' />
							</div>

							<div className='animate-pulse bg-green-500 text-red-100 rounded-full h-3 w-3 absolute bottom-0 right-0'></div>
						</div>

						<p>
							{user?.firstName} {user?.lastName}
						</p>
					</div>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>{user?.email}</MenubarItem>
					<MenubarSeparator />
					<MenubarItem onClick={handleLogOut}>
						<LogOut className='w-4 h-4 mr-2' />
						Log Out
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};
export default ClientNavbar;
