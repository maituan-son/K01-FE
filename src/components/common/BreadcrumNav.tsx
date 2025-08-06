import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
	path: string;
	label: string;
}

interface BreadcrumbNavProps {
	items: BreadcrumbItem[];
}

const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
	return (
		<Breadcrumb style={{ marginBottom: 16 }}>
			{items.map((item, idx) => (
				<Breadcrumb.Item key={item.path}>
					{idx === 0 ? <Link to={item.path}>{item.label}</Link> : item.label}
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	);
};

export default BreadcrumbNav;
