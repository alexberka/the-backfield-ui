/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container } from 'react-bootstrap';
import { signIn } from '../utils/auth';

export default function NavBarNoAuth() {
  return (
    <Navbar className="nav" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <span className="nav-the">THE</span>
          <span className="nav-backfield">BACKFIELD</span>
        </Link>
        <button className="button button-red" type="button" onClick={signIn}>
          SIGN IN
        </button>
      </Container>
    </Navbar>
  );
}
