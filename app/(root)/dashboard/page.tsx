import { getAllUsers, getUser } from '@/actions/user.actions';
import { UserClient } from '@/components/tables/users/client';

const DashboardPage = async () => {
	const user = await getUser();
	const allUsers = await getAllUsers();

	return <UserClient data={allUsers as User[]} currentUser={user as User} />;
};
export default DashboardPage;
