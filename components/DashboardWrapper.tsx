interface DashboardWrapperProps {
	children: React.ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
	return <div>{children}</div>;
};

export default DashboardWrapper;
