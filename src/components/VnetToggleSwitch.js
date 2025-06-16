import { createContext, useContext, useState } from 'react'

export const ToggleContext = createContext(false)

export function ToggleProvider({ children }) {
  const [visible, setVisible] = useState(false)

  return (
    <ToggleContext.Provider value={{ visible, setVisible }}>
      {children}
    </ToggleContext.Provider>
  )
}

export function useToggle() {
  return useContext(ToggleContext)
}

export function ToggleSwitch() {
  const { visible, setVisible } = useToggle()

  return (
    <label className="toggle-container" style={{ cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={visible}
        className="toggle-checkbox"
        onChange={() => setVisible(!visible)}
        style={{ marginRight: '0.5rem' }}
      />
      <span className="toggle-slider" />
      <strong>Show VNET options</strong>
    </label>
  )
}

export function ToggleSection({ children }) {
  const { visible } = useToggle()
  return visible ? <div className="vnet">{children}</div> : null
}

export function ToggleRow({ children }) {
  const { visible } = useToggle()
  return visible ? <tr className="vnet">{children}</tr> : null
}