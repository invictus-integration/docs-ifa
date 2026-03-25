import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import versions from '../../versions.json';

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

const UserTypeContext = createContext();

export function UserTypeProvider({ children }) {
  const history = useHistory();
  const [sidebar, setSidebar] = useState(null);
  const location = useLocation();
  const pluginData = usePluginData('docusaurus-plugin-content-docs');

  const currentVersion = pluginData?.versions?.find(v => v.isLast) || versions[0];
  const versionPath = currentVersion?.name || 'current';

  useEffect(() => {
    const loadSidebar = async () => {
      try {
        const module = await import(`../../versioned_sidebars/version-${versionPath}-sidebars.json`);
        setSidebar(module.default || module);
      } catch (error) {
        console.error('Failed to load sidebar:', error);
      }
    };
    loadSidebar();
  }, [versionPath]);

  const businessIds = sidebar ? flattenItems(sidebar.business_users || []) : [];
  const technicalIds = sidebar ? flattenItems(sidebar.technical_users || []) : [];

  const [userType, setUserType] = useState('business');
  useEffect(() => {
    if (!sidebar) return;
    const path = location.pathname.replace(/^\/|\/$/g, '');
    if (businessIds.some(id => path.includes(id))) setUserType('business');
    else if (technicalIds.some(id => path.includes(id.replace('/index', '')))) setUserType('technical');
  }, [location.pathname, sidebar, businessIds, technicalIds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

      if (e.altKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        const newType = userType === 'business' ? 'technical' : 'business';
        setUserType(newType);
        if (newType === 'business') history.push('/');
        else history.push('/technical');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userType, history]);


  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export const useUserType = () => useContext(UserTypeContext);