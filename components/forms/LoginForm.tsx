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
import { loginFormSchema } from '@/schemas';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth.actions';

const LoginForm = () => {
	const router = useRouter();
	const { toast } = useToast();
	// 1. Define your form.
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		const formData = new FormData();
		formData.append('email', values.email.toLowerCase());
		formData.append('password', values.password);
		const result = await login(formData);

		// if there is a message, show it to the user
		if (result?.message) {
			toast({
				variant: 'destructive',
				title: '⚠️ Something went wrong 😧',
				description: result.message,
			});
		} else {
			router.push('/dashboard');
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 w-[80%]'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
									placeholder='Enter your email'
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
									className='bg-[#6d5c92] placeholder:text-[#b5a8d3]'
									type='password'
									placeholder='Enter your password'
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
						'Log In'
					)}
				</Button>
			</form>
		</Form>
	);
};
export default LoginForm;
