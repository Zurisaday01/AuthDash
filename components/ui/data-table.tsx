'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	PaginationState,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

import Toolbar from '../Toolbar';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey: string;
	currentUser: User;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	currentUser,
}: DataTableProps<TData, TValue>) {
	// Add pagination state
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		getRowId: row => (row as User).id,
	});

	// Compute the data for the current page
	const pageData = table
		.getRowModel()
		.rows.slice(
			pagination.pageIndex * pagination.pageSize,
			pagination.pageIndex * pagination.pageSize + pagination.pageSize
		);

	return (
		<>
			<div className='flex items-center gap-2 mb-4'>
				{/* TOOLBAR */}
				<Input
					placeholder={`Search by first name...`}
					value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className='w-full md:max-w-sm'
				/>

				<Toolbar
				currentUser={currentUser}
					selectedRowsIds={Object.keys(rowSelection)}
					onClearRowSelection={() => {
						setRowSelection({});
					}}
				/>
			</div>

			<ScrollArea className='h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]'>
				<Table className='relative'>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{pageData.length ? (
							pageData.map(row => (
								<TableRow
									key={row.id}
									style={{
										backgroundColor:
											(row.original as User).id === currentUser.id
												? '#ab90e731'
												: '',
									}}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>

			<div className='flex items-center justify-between space-x-2 py-4'>
				<div className='flex items-center gap-2 text-sm'>
					<p className='flex items-center gap-1'>
						Page{' '}
						<span className='font-bold'>
							{table.getState().pagination.pageIndex + 1}
						</span>
						of{' '}
						<span className='font-bold'>
							{table.getPageCount().toLocaleString()}
						</span>
					</p>
					<span className='flex items-center gap-1'>
						<span className='text-gray-500'>|</span> Go to page:{' '}
						<Input
							type='number'
							min='1'
							max={table.getPageCount()}
							defaultValue={table.getState().pagination.pageIndex + 1}
							disabled={!table.getCanPreviousPage() && !table.getCanNextPage()}
							onChange={e => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							}}
							className='w-16 rounded border p-1'
						/>
					</span>
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={value => {
							table.setPageSize(Number(value));
						}}>
						<SelectTrigger className='w-[110px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[10, 15, 20].map(pageSize => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									Show {pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</>
	);
}
