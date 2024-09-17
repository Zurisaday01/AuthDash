'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RocketIcon } from '@radix-ui/react-icons';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	description: string;
	containsCurrentUser?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	description,
	containsCurrentUser,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Modal
			title='Are you sure?'
			description={description}
			isOpen={isOpen}
			onClose={onClose}>
			<div>
				{containsCurrentUser && (
					<Alert variant='destructive'>
						<RocketIcon className='h-4 w-4' />
						<AlertTitle>Your selection contains your account!</AlertTitle>
						<AlertDescription>
							Blocking or deleting your account will log you out.
						</AlertDescription>
					</Alert>
				)}

				<div className='flex w-full items-center justify-end space-x-2 pt-6'>
					<Button disabled={loading} variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button disabled={loading} variant='destructive' onClick={onConfirm}>
						{loading ? 'Loading...' : <span>Continue</span>}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
