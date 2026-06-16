import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faICursor, faSquareCheck, faAngleDown, faToggleOff, faArrowsUpDown, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
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