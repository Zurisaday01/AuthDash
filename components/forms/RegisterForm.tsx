'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerFormSchema } from '@/schemas';
import { signup } from '@/actions/auth.actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
	const router = useRouter();
	const { toast } = useToast();
	// 1. Define your form.
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		// use server action
		const formData = new FormData();
		formData.append('firstName', values.firstName);
		formData.append('lastName', values.lastName);
		formData.append('email', values.email.toLowerCase());
		formData.append('password', values.password);
		formData.append('confirmPassword', values.confirmPassword);
		const result = await signup(formData);

		if (result?.message) {
			toast({
				variant: 'destructive',
				title: '⚠️ Something went wrong 😧',
				description: result.message,
			});
		} else {
			toast({
				title: '🎉 Account created',
				description: 'Your account has been created successfully',
			});
			router.push('/login');
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 w-[80%]'>
				<div className='flex gap-4'>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem className='flex-1'>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
										placeholder='Enter your first name'
										disabled={
											form.formState.isSubmitting || form.formState.isLoading
										}
										{...field}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem className='flex-1'>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your last name'
										className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
										disabled={
											form.formState.isSubmitting || form.formState.isLoading
										}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='Enter your email'
									className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
									disabled={
										form.formState.isSubmitting || form.formState.isLoading
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
									placeholder='Create a password (at least 1 character)'
									disabled={
										form.formState.isSubmitting || form.formState.isLoading
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Confirm your password'
									className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
									disabled={
										form.formState.isSubmitting || form.formState.isLoading
									}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className='w-full'
					type='submit'
					disabled={form.formState.isSubmitting || form.formState.isLoading}>
					{form.formState.isSubmitting || form.formState.isLoading ? (
						<div>Loading...</div>
					) : (
						'Sign Up'
					)}
				</Button>
			</form>
		</Form>
	);
};
export default RegisterForm;
