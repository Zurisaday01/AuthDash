'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { columns } from './columns';

interface ProductsClientProps {
	data: User[];
	currentUser: User;
}

export const UserClient: React.FC<ProductsClientProps> = ({
	data,
	currentUser,
}) => {
	return (
		<>
			<div className='flex items-start justify-between mb-6'>
				<Heading
					title={`Users (${data.length})`}
					description='List of all users.'
				/>
			</div>

			<DataTable
				searchKey='firstName'
				columns={columns}
				data={data}
				currentUser={currentUser}
			/>
		</>
	);
};
