'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMinus, UserPlus, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AlertModal } from './modal/alert-modal';
import { logout } from '@/lib/server';

interface ToolbarProps {
	currentUser: User;
	selectedRowsIds: string[];
	onClearRowSelection: () => void;
}

const Toolbar = ({
	currentUser,
	selectedRowsIds,
	onClearRowSelection,
}: ToolbarProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [blocking, setBlocking] = useState(false);
	const [unblocking, setUnblocking] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [openBlock, setOpenBlock] = useState(false);
	const [openUnBlock, setOpenUnblock] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const handleBlock = async () => {
		setBlocking(true);
		try {
			const response = await fetch('/api/auth/update-status', {
				method: 'POST',
				body: JSON.stringify({ userIds: selectedRowsIds, status: 'blocked' }),
			});

			toast({
				title: '🎉 Success',
				description: (await response.json()).message,
			});

			onClearRowSelection();

			// if the user is blocking themselves, log them out
			if (selectedRowsIds.includes(currentUser.id)) {
				await logout();
				router.push('/login');
			}

			router.refresh();
		} catch (error) {
			toast({
				variant: 'destructive',
				title: '⚠️ Something went wrong 😧',
				description: `Error blocking the ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`,
			});
		} finally {
			setOpenBlock(false);
			setBlocking(false);
		}
	};

	const handleUnblock = async () => {
		setUnblocking(true);
		try {
			const response = await fetch('/api/auth/update-status', {
				method: 'POST',
				body: JSON.stringify({
					userIds: selectedRowsIds,
					status: 'active',
				}),
			});

			onClearRowSelection();

			toast({
				title: '🎉 Success',
				description: (await response.json()).message,
			});
			// Refresh the page using the router because I am fetching using a server action (server) and posting using route handler (client)
			// this means that the page will not automatically refresh when the data changes
			router.refresh();
		} catch (error) {
			toast({
				variant: 'destructive',
				title: '⚠️ Something went wrong 😧',
				description: `Error unblocking the ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`,
			});
		} finally {
			setOpenUnblock(false);
			setUnblocking(false);
		}
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			const response = await fetch('/api/auth/delete-users', {
				method: 'DELETE',
				body: JSON.stringify({ userIds: selectedRowsIds }),
			});

			toast({
				title: '🎉 Success',
				description: (await response.json()).message,
			});

			if (selectedRowsIds.includes(currentUser.id)) {
				router.push('/login');
			}

			router.refresh();
		} catch (error) {
			toast({
				variant: 'destructive',
				title: '⚠️ Something went wrong 😧',
				description: `Error deleting the ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`,
			});
		} finally {
			setOpenDelete(false);
			setDeleting(false);
		}
	};
	return (
		<>
			<AlertModal
				isOpen={openBlock}
				description={`This action will block the selected ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`}
				containsCurrentUser={selectedRowsIds.includes(currentUser.id)}
				onClose={() => setOpenBlock(false)}
				onConfirm={handleBlock}
				loading={blocking}
			/>

			<AlertModal
				isOpen={openUnBlock}
				description={`This action will unblock the selected ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`}
				onClose={() => setOpenUnblock(false)}
				onConfirm={handleUnblock}
				loading={unblocking}
			/>

			<AlertModal
				isOpen={openDelete}
				description={`This action will delete the selected ${
					selectedRowsIds.length > 1 ? 'users' : 'user'
				}`}
				containsCurrentUser={selectedRowsIds.includes(currentUser.id)}
				onClose={() => setOpenDelete(false)}
				onConfirm={handleDelete}
				loading={deleting}
			/>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenBlock(true)}
							disabled={blocking || selectedRowsIds?.length === 0}>
							<UserMinus className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Block</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenUnblock(true)}
							disabled={unblocking || selectedRowsIds?.length === 0}>
							<UserPlus className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Unblock</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={() => setOpenDelete(true)}
							disabled={deleting || selectedRowsIds?.length === 0}>
							<UserX className='text-gray-500' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</>
	);
};
export default Toolbar;
