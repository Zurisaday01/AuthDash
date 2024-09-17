import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// create a new User record: https://www.prisma.io/docs/getting-started/quickstart
	const user = await prisma.user.create({
		data: {
			firstName: 'Zurisaday',
            lastName: 'Espadas',
            email: 'zurisaday_01@hotmail.com',
            password: '$2a$10$eFwQU6ifdyuGcGyA85WKaOrqadCSislxxBZGjCR5obE6hjum9oiPO', // https://www.devglan.com/online-tools/bcrypt-hash-generator
			status: 'active',
		},
	});
	console.log(user);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
