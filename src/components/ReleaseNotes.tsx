import React, { ReactNode, useState, useEffect, useRef } from 'react';
import './ReleaseNotes.css';
import Admonition from '@theme/Admonition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGear, faBug, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useHistory } from '@docusaurus/router';

type SectionProps = { children: ReactNode };
type VersionProps = { version: string; date: string; children: ReactNode; isLatest?: boolean; forceExpanded?: boolean };

// ── Filter wrapper ───────────────────────────────────────────────

function minorSeries(version: string): string {
  const parts = version.split('.');
  return parts.slice(0, 2).join('.');
}

export function ReleaseNotes({ children }: { children: ReactNode }) {
  const location = useLocation();
  const history = useHistory();

  const [activeSeries, setActiveSeries] = useState<string>(() => {
    return new URLSearchParams(location.search).get('minor') ?? '';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeSeries) {
      params.set('minor', activeSeries);
    } else {
      params.delete('minor');
    }
    const newSearch = params.toString();
    if (newSearch !== location.search.replace(/^\?/, '')) {
      history.replace({ ...location, search: newSearch ? `?${newSearch}` : '' });
    }
  }, [activeSeries]);

  const allEntries = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<VersionProps> =>
      React.isValidElement(child) && typeof (child.props as any).version === 'string'
  );

  const series = [...new Set(allEntries.map(child => minorSeries(child.props.version)))];

  const visible = activeSeries
    ? allEntries.filter(child => minorSeries(child.props.version) === activeSeries)
    : allEntries;

  const options = [
    { value: '', label: 'All versions' },
    ...series.map(s => ({ value: s, label: `v${s}` })),
  ];

  const visibleWithMeta = visible.map((child, index) =>
    React.cloneElement(child, {
      isLatest: index === 0 && !activeSeries,
      forceExpanded: !!activeSeries,
    })
  );

  return (
    <div>
      <div style={filterBarStyle}>
        <label htmlFor="rn-series-filter" style={filterLabelStyle}>Version</label>
        <SeriesDropdown
          id="rn-series-filter"
          value={activeSeries}
          options={options}
          onChange={setActiveSeries}
        />
      </div>
      {visibleWithMeta}
    </div>
  );
}

// ── Custom dropdown ──────────────────────────────────────────────

type Option = { value: string; label: string };

function SeriesDropdown({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find(o => o.value === value) ?? options[0];

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onOutsideClick);

    return () =>
      document.removeEventListener(
        'mousedown',
        onOutsideClick,
      );
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent,
  ) => {
    if (e.key === 'Escape') setOpen(false);

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(o => !o);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      const idx = options.findIndex(
        o => o.value === value,
      );

      onChange(
        options[
          Math.min(idx + 1, options.length - 1)
        ].value,
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      const idx = options.findIndex(
        o => o.value === value,
      );

      onChange(
        options[Math.max(idx - 1, 0)].value,
      );
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        style={{
          ...triggerStyle,
          ...((focused || open)
            ? triggerFocusStyle
            : {}),
        }}
      >
        <span>{selected.label}</span>

        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            fontSize: '0.7rem',
            opacity: 0.7,
            transition:
              'transform 0.2s ease, opacity 0.2s ease',
            transform: open
              ? 'rotate(180deg)'
              : 'none',
          }}
        />
      </button>

      {open && (
        <ul role="listbox" style={listStyle}>
          {options.map(option => {
            const isActive =
              option.value === value;

            return (
              <DropdownOption
                key={option.value}
                label={option.label}
                active={isActive}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DropdownOption({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <li
      role="option"
      aria-selected={active}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...optionStyle,
        ...(active
          ? optionActiveStyle
          : hover
            ? optionHoverStyle
            : {}),
      }}
    >
      {label}
    </li>
  );
}

// ── Dropdown styles ──────────────────────────────────────────────

const triggerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.4rem',

  height: '2.25rem',
  padding: '0 0.75rem',

  border: `3px solid var(--ifm-color-emphasis-300)`,
  borderRadius: '0.5rem',

  background: 'transparent',

  fontSize: '0.9rem',
  fontWeight: 500,
  fontFamily: 'var(--ifm-font-family-base)',

  cursor: 'pointer',
  outline: 'none',

  transition:
    'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',

  minWidth: '160px',
};

const triggerFocusStyle: React.CSSProperties = {
  background: 'var(--ifm-hover-overlay)',
};

const listStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  left: 0,

  minWidth: '220px',

  margin: 0,
  padding: '0.35rem',

  listStyle: 'none',

  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '0.75rem',

  background:
    'var(--ifm-dropdown-background-color)',

  boxShadow:
    '0 8px 24px rgba(0, 0, 0, 0.12)',

  zIndex: 100,
};

const optionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',

  padding: '0.55rem 0.75rem',

  borderRadius: '0.5rem',

  cursor: 'pointer',

  fontSize: '0.9rem',
  fontWeight: 500,
  fontFamily: 'var(--ifm-font-family-base)',

  color: 'var(--ifm-font-color-base)',

  transition:
    'background-color 0.15s ease, color 0.15s ease',
};

const optionHoverStyle: React.CSSProperties = {
  background: 'var(--ifm-hover-overlay)',
};

const optionActiveStyle: React.CSSProperties = {
  background:
    'var(--ifm-menu-color-background-active)',
  color: 'var(--ifm-menu-color-active)',
};

// ── Version entry ────────────────────────────────────────────────

export function ReleaseVersion({ version, date, children, isLatest = false, forceExpanded = false }: VersionProps) {
  const [expanded, setExpanded] = useState(isLatest || forceExpanded);

  useEffect(() => {
    if (forceExpanded) setExpanded(true);
  }, [forceExpanded]);

  const isCollapsible = !isLatest && !forceExpanded;

  return (
    <div
      data-version={version}
      className={isCollapsible && !expanded ? 'rn-version-block--collapsed' : undefined}
      style={{ ...versionStyle, ...(isLatest ? latestVersionStyle : {}) }}
      onClick={isCollapsible && !expanded ? () => setExpanded(true) : undefined}
      role={isCollapsible && !expanded ? 'button' : undefined}
      tabIndex={isCollapsible && !expanded ? 0 : undefined}
      aria-expanded={isCollapsible && !expanded ? false : undefined}
      onKeyDown={isCollapsible && !expanded ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(true); } } : undefined}
    >
      <div
        className={isCollapsible && expanded ? 'rn-version-collapsible' : undefined}
        style={{ ...versionHeaderStyle, ...(isCollapsible ? versionHeaderClickableStyle : {}) }}
        onClick={isCollapsible && expanded ? () => setExpanded(false) : undefined}
        role={isCollapsible && expanded ? 'button' : undefined}
        tabIndex={isCollapsible && expanded ? 0 : undefined}
        aria-expanded={isCollapsible && expanded ? true : undefined}
        onKeyDown={isCollapsible && expanded ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(false); } } : undefined}
      >
        <div style={headingRowStyle}>
          <h2 style={headingStyle}>
            v{version}
            {isLatest && <span className="rn-latest-badge">Latest</span>}
            <span style={dateStyle}>{date}</span>
          </h2>

        </div>
        {isCollapsible && (
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ fontSize: '0.8rem', padding: '0.5rem', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none', color: 'var(--ifm-color-gray-500)', flexShrink: 0 }}
          />
        )}
      </div>
      {expanded && <div style={sectionsStyle}>{children}</div>}
    </div>
  );
}

// ── Section types ────────────────────────────────────────────────

export function Features({ children }: SectionProps) {
  return <Admonition type="tip" className="rn-admonition-feature" icon={<FontAwesomeIcon icon={faStar} />} title="Features">{children}</Admonition>;
}

export function TechChanges({ children }: SectionProps) {
  return <Admonition type="info" className="rn-admonition-technical" icon={<FontAwesomeIcon icon={faGear} />} title="Technical">{children}</Admonition>;
}

export function Fixes({ children }: SectionProps) {
  return <Admonition type="warning" className="rn-admonition-fix" icon={<FontAwesomeIcon icon={faBug} />} title="Fixes">{children}</Admonition>;
}

// ── Styles ───────────────────────────────────────────────────────

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem',
};

const filterLabelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--ifm-color-emphasis-700)',
  fontFamily: 'var(--ifm-font-family-base)',
  whiteSpace: 'nowrap',
};

const versionStyle: React.CSSProperties = {
  paddingTop: '1.5rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid var(--ifm-color-emphasis-200)',
};

const latestVersionStyle: React.CSSProperties = {
  paddingBottom: '2rem',
};

const versionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
};

const versionHeaderClickableStyle: React.CSSProperties = {
  cursor: 'pointer',
  borderRadius: '0.5rem',
  padding: '0.25rem 0.5rem',
  margin: '0 -0.5rem',
  transition: 'background 0.15s',
};

const headingRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
  flex: 1,
};

const headingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.6rem',
  flexWrap: 'wrap',
  margin: 0,
  padding: '0.5rem',
};

const dateStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 400,
  fontFamily: 'var(--ifm-font-family-base)',
  color: 'var(--ifm-color-emphasis-600)',
};

const sectionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1rem',
};

