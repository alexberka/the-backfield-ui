import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import SignIn from '@/components/SignIn';
import NavBar from '@/components/NavBar';
import { usePathname } from 'next/navigation';
import NavBarNoAuth from '../../components/NavBarNoAuth';

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

  // what the user should see if they are logged in
  if (user) {
    return (
      <>
        <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
        {children}
      </>
    );
  }

  return <SignIn />;
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
