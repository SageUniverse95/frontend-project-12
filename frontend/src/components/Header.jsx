import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Header = ({ children }) => (
  <Navbar className="shadow-sm bg-white" expand="lg">
    <Container>
      <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
      {children}
    </Container>
  </Navbar>
);
export default Header;
