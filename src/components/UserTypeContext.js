import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import versions from '../../versions.json';

const STORAGE_KEY = 'invictus-user-type';
const BUSINESS_ROOT = '/';
const TECHNICAL_ROOT = '/technical';

function flattenItems(items) {
  const result = [];
  function recurse(arr) {
    for (const item of arr) {
      if (typeof item === 'string') {
        result.push(item);
      } else if (item.type === 'category') {
        if (item.link?.type === 'doc' && item.link.id) result.push(item.link.id);
        if (item.items) recurse(item.items);
      }
    }
  }
  recurse(items);
  return result;
}

function readStoredUserType() {
  try { return localStorage.getItem(STORAGE_KEY) || 'business'; } catch { return 'business'; }
}

function writeStoredUserType(type) {
  try { localStorage.setItem(STORAGE_KEY, type); } catch { }
}

function normalizeId(id) {
  return id.replace('/index', '');
}

function pathMatchesId(path, id) {
  const normalized = normalizeId(id);
  return path === normalized || path.endsWith('/' + normalized);
}

function detectUserTypeFromPath(path, businessIds, technicalIds) {
  if (businessIds.some(id => pathMatchesId(path, id))) return 'business';
  if (technicalIds.some(id => pathMatchesId(path, id))) return 'technical';
  return null;
}

function isRootPage(pathname) {
  return pathname === BUSINESS_ROOT || pathname === '';
}

const UserTypeContext = createContext();

export function UserTypeProvider({ children }) {
  const history = useHistory();
  const location = useLocation();
  const pluginData = usePluginData('docusaurus-plugin-content-docs');

  const currentVersion = pluginData?.versions?.find(v => v.isLast) || versions[0];
  const versionPath = currentVersion?.name || 'current';

  const [sidebar, setSidebar] = useState(null);
  const [userType, setUserTypeState] = useState(readStoredUserType);

  const businessIds = sidebar ? flattenItems(sidebar.business_users || []) : [];
  const technicalIds = sidebar ? flattenItems(sidebar.technical_users || []) : [];

  function setUserType(type) {
    writeStoredUserType(type);
    setUserTypeState(type);
  }

  useEffect(() => {
    import(`../../versioned_sidebars/version-${versionPath}-sidebars.json`)
      .then(module => setSidebar(module.default || module))
      .catch(err => console.error('Failed to load sidebar:', err));
  }, [versionPath]);

  useEffect(() => {
    if (!sidebar) return;
    const path = location.pathname.replace(/^\/|\/$/g, '');
    const detected = detectUserTypeFromPath(path, businessIds, technicalIds);
    if (detected) setUserType(detected);
  }, [location.pathname, sidebar]);

  useEffect(() => {
    if (isRootPage(location.pathname) && userType === 'technical') {
      history.replace(TECHNICAL_ROOT);
    }
  }, [location.pathname, userType]);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (!e.altKey || e.key.toLowerCase() !== 'u') return;

      e.preventDefault();
      const newType = userType === 'business' ? 'technical' : 'business';
      setUserType(newType);
      history.push(newType === 'business' ? BUSINESS_ROOT : TECHNICAL_ROOT);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [userType, history]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export const useUserType = () => useContext(UserTypeContext);
