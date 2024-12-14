import React, { useState } from 'react';
import { useAuth } from '../../utils/context/authContext';
import { createUser } from '../../api/userData';

export default function UserForm() {
  const [formData, setFormData] = useState({
    username: '',
  });
  const { user, updateUser } = useAuth();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createUser({ ...formData, uid: user.uid }).then(() => updateUser(user.uid));
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Create Username &#91;Must be 5+ characters&#93;
        <input name="username" value={formData.username} onChange={onChange} />
      </label>
      <button type="submit" disabled={formData.username.length < 5}>
        Submit
      </button>
    </form>
  );
}
