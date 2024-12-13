/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Button } from 'react-bootstrap';
import { signIn } from '../utils/auth';

export default function NavBarNoAuth() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          The Backfield
        </Link>
        <Button variant="info" onClick={signIn}>
          Sign In
        </Button>
      </Container>
    </Navbar>
  );
}
