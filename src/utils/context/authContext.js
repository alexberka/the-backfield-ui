// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { firebase } from '@/utils/client';
import { getUserByUID } from '../../api/userData';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext'; // Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context. https://reactjs.org/docs/context.html#contextdisplayname

function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);
  const hasLoggedIn = useRef(false);

  // there are 3 states for the user:
  // null = application initial state, not yet loaded
  // false = user is not logged in, but the app has loaded
  // an object/value = user is logged in

  const updateUser = useMemo(
    () => (uid) =>
      getUserByUID(uid).then((appUser) => {
        if (appUser.sessionKey) {
          setUser({ fbUser: oAuthUser, ...appUser });
        }
      }),
    [oAuthUser],
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        if (!hasLoggedIn.current) {
          setOAuthUser(fbUser);
          getUserByUID(fbUser.uid).then((appUser) => {
            if (appUser.sessionKey) {
              setUser({ fbUser, ...appUser });
            } else {
              setUser(fbUser);
            }
          });
          hasLoggedIn.current = true;
        }
      } else {
        setOAuthUser(false);
        setUser(false);
      }
    }); // creates a single global listener for auth state changed
  }, []);

  const value = useMemo(
    // https://reactjs.org/docs/hooks-reference.html#usememo
    () => ({
      user,
      updateUser,
      userLoading: user === null,
      // as long as user === null, will be true
      // As soon as the user value !== null, value will be false
    }),
    [user, updateUser],
  );

  return <AuthContext.Provider value={value} {...props} />;
}
const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthConsumer };
