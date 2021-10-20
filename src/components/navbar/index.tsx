import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface NavBarWrapperProps {
	address: string;
}

const NavBarWrapper: React.FC<NavBarWrapperProps> = ({ address }) => {
	return (
		<Navbar>
			<Container>
				<Nav>
					<Nav.Item>
						<Nav.Link as={Link} to="/">
							Home
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link as={Link} to="/item">
							Create Item
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link as={Link} to="/collection">
							Collection
						</Nav.Link>
					</Nav.Item>
				</Nav>
				<Navbar.Collapse className="justify-content-end">
					<Navbar.Text>
						Signed in as: <a href="#">{address}</a>
					</Navbar.Text>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBarWrapper;
