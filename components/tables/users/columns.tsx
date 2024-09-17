'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const formatOptions: Intl.DateTimeFormatOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
};

export const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<input
				type='checkbox'
				checked={table.getIsAllRowsSelected()}
				onChange={table.getToggleAllRowsSelectedHandler()}
			/>
		),
		cell: ({ row }) => (
			<input
				type='checkbox'
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler()}
			/>
		),
	},
	{
		accessorKey: 'firstName',
		header: 'FIRST NAME',
	},
	{
		accessorKey: 'lastName',
		header: 'SECOND NAME',
	},
	{
		accessorKey: 'email',
		header: 'EMAIL',
	},
	{
		accessorKey: 'status',
		header: 'STATUS',
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<Badge
					className={` ${
						status === 'active'
							? 'bg-green-600 hover:bg-green-600/85'
							: 'bg-red-600 hover:bg-red-600/85'
					}`}>
					{status.toUpperCase()}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'lastLogin',
		header: 'LAST LOGIN AT',
		cell: ({ row }) =>
			row.original.lastLogin
				? new Date(row.original.lastLogin).toLocaleTimeString(
						'en-us',
						formatOptions
				  )
				: 'Never',
	},
	{
		accessorKey: 'registrationTime',
		header: 'REGISTRATION AT',
		cell: ({ row }) =>
			new Date(row.original.registrationTime).toLocaleTimeString(
				'en-us',
				formatOptions
			),
	},
];
