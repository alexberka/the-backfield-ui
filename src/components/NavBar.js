/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <Navbar className="nav" expand="lg" variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <span className="nav-the">THE</span>
          <span className="nav-backfield">BACKFIELD</span>
        </Link>
        <Nav className="nav-items">
          <Link className={`nav-link ${pathname.startsWith('/teams') && 'nav-active'}`} href="/teams">
            TEAMS
          </Link>
          <Link className={`nav-link ${pathname.startsWith('/games') && 'nav-active'}`} href="/games">
            GAMES
          </Link>
        </Nav>
        <button className="button" type="button" onClick={signOut}>
          SIGN OUT
        </button>
      </Container>
    </Navbar>
  );
}
