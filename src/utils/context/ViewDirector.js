import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import SignIn from '@/components/SignIn';
import NavBar from '@/components/header-footer/NavBar';
import { usePathname } from 'next/navigation';
import NavBarNoAuth from '../../components/header-footer/NavBarNoAuth';
import UserForm from '../../components/forms/UserForm';

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const { user, userLoading } = useAuth();
  const pathname = usePathname();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  if (!user && pathname.startsWith('/watch/')) {
    return (
      <>
        <NavBarNoAuth />
        {children}
      </>
    );
  }

  if (user) {
    return (
      <>
        {pathname !== '/' && <NavBar />} {/* NavBar only visible if user is logged in and not on home page */}
        {user.sessionKey ? children : <UserForm />}
      </>
    );
  }

  return <SignIn />;
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
