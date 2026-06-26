import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faICursor, faSquareCheck, faAngleDown, faToggleOff, faArrowsUpDown, faCirclePlus, faPeopleGroup, faSliders } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark, faUser, faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faSquare, faFolder } from '@fortawesome/free-regular-svg-icons';
import { useColorMode } from '@docusaurus/theme-common';

export const SearchBoxStyle = {
  border: '1px solid var(--ifm-color-gray-300)',
  color: 'var(--ifm-color-gray-700)',
  backgroundColor: 'var(--ifm-color-secondary-lighter)',
  padding: '0.25rem 0.5rem',
  fontSize: '0.875rem',
  borderRadius: '5px',
}

export const TableHeaderStyle = {
  fontWeight: 'bold',
  fontSize: '0.875rem',
  padding: '0.5rem',
}

export const NoListStyle = {
  listStyleType: 'none',
  paddingLeft: '0',
}

export const TextInputStyle = {
  border: '1px solid var(--ifm-color-gray-300)',
  color: 'var(--ifm-color-gray-700)',
  backgroundColor: 'var(--ifm-color-secondary-lighter)',
  padding: '0.25rem 0.5rem',
  fontSize: '0.875rem',
  fontWeight: 'normal',
  borderRadius: '5px',
  whiteSpace: 'nowrap',
}

export const TextInputDarkStyle = {
  ...TextInputStyle,
  backgroundColor: 'var(--ifm-background-color)',
  color: 'var(--ifm-color-gray-300)',
  border: '1px solid var(--ifm-color-gray-600)',
}

export function DateInput() {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={faCalendar} /> your date</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={faCalendar} /> your date</span>
      )}
    </>
  );
}

export function TextInput({ label, icon }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={icon || faICursor} /> {label}</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={icon || faICursor} /> {label}</span>
      )}
    </>
  );
}

export function NumberInput({ label }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}>{label} <FontAwesomeIcon icon={faArrowsUpDown} /></span>
      ) : (
        <span style={TextInputStyle}>{label} <FontAwesomeIcon icon={faArrowsUpDown} /></span>
      )}
    </>
  );
}

export function ToggleInput({ label, toggled }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={toggled ? faToggleOff : faToggleOff} /> {label}</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={toggled ? faToggleOff : faToggleOff} /> {label}</span>
      )}
    </>
  );
}

export function CheckBoxInput({ label, checked }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={checked ? faSquareCheck : faSquare} /> {label}</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={checked ? faSquareCheck : faSquare} /> {label}</span>
      )}
    </>
  );
}

export function DropDownInput({ label }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}>{label} <FontAwesomeIcon icon={faAngleDown} /></span>
      ) : (
        <span style={TextInputStyle}>{label} <FontAwesomeIcon icon={faAngleDown} /></span>
      )}
    </>
  );
}

export function AddInput({ label }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={faCirclePlus} /> {label}</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={faCirclePlus} /> {label}</span>
      )}
    </>
  );
}

export function Folder({ label }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><FontAwesomeIcon icon={faFolder} /> {label}</span>
      ) : (
        <span style={TextInputStyle}><FontAwesomeIcon icon={faFolder} /> {label}</span>
      )}
    </>
  );
}

export function Flow({ label }) {
  const { colorMode } = useColorMode();
  return (
    <>
      {colorMode === 'dark' ? (
        <span style={TextInputDarkStyle}><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="chakra-icon css-w8v3vn" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"></path></svg> {label}</span>
      ) : (
        <span style={TextInputStyle}><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="chakra-icon css-w8v3vn" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"></path></svg> {label}</span>
      )}
    </>
  );
}


export function DisallowIcon(props) {
  return <FontAwesomeIcon icon={faCircleXmark} color="#dc2626" aria-label="Not allowed" {...props} />
}

export function AllowIcon(props) {
  return <FontAwesomeIcon icon={faCircleCheck} color="#047857" aria-label="Allowed" {...props} />
}

export function UsersTab() {
  return Tab({ icon: faUser, label: "Users" });
}

export function GroupsTab() {
  return Tab({ icon: faPeopleGroup, label: "Groups" });
}

export function SettingsTab() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      aria-label="Settings tab"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', fontSize: '0.75rem', alignItems: 'center', backgroundColor: 'var(--ifm-color-primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', filter: hovered ? 'brightness(0.88)' : 'none', transition: 'filter 0.15s ease' }}>
      <i>Profile_name</i>
      <FontAwesomeIcon icon={faSliders} style={{ marginLeft: '0.25rem' }} />
    </div>
  );
}

export function AuditsTab() {
  return Tab({ icon: faNewspaper, label: "Audits" });
}

export function SignInWithMicrosoftButton() {
  return Tab({ icon: faMicrosoft, label: "Sign in with...", backgroundColor: '#1F73AD' });
}

export function Tab({ icon, label, backgroundColor = 'var(--ifm-color-primary)' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', fontSize: '0.75rem', alignItems: 'center', backgroundColor: backgroundColor, color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', filter: hovered ? 'brightness(0.88)' : 'none', transition: 'filter 0.15s ease' }}>
      <FontAwesomeIcon icon={icon} style={{ marginRight: '0.25rem' }} />
      {label}
    </div>
  );
}

export function Button({ icon, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', fontSize: '0.75rem', alignItems: 'center', color: hovered ? 'white' : 'var(--ifm-color-primary)', backgroundColor: hovered ? 'var(--ifm-color-primary)' : 'var(--ifm-background-color)', border: '1px solid var(--ifm-color-primary)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', transition: 'background-color 0.15s ease, color 0.15s ease' }}>
      {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: '0.25rem' }} />}
      {label}
    </span>
  );
}

export function SROnly({ children }) {
  return <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>{children}</span>;
}