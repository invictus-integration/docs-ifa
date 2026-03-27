import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import UserTypeSwitcher from '../../components/UserTypeSwitcher';

export default function NavbarItemWrapper(props) {
  if (props.type === 'custom-user-type-switcher') {
    return <UserTypeSwitcher />;
  }
  return (
    <>
      <NavbarItem {...props} />
    </>
  );
}
