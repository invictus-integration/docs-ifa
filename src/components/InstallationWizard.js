import { useState, Children } from 'react';

export function Step({ title, children }) {
  return null;
}

export function SharedNote() {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: '8px', textTransform: 'none', fontWeight: 'bold' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        style={{
          backgroundColor: '#e0f7f7',
          color: '#0b6369',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          fontFamily: 'Bitter',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        Shared
      </span>
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            fontFamily: 'Bitter',
            fontWeight: 'normal',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          This section is the same for both Dashboard and Framework. Can be skipped if done already.
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              marginLeft: '-5px',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #333',
            }}
          />
        </span>
      )}
    </span>
  );
}

export default function InstallationWizard({ children }) {
  const steps = Children.map(children, (child) => {
    if (child.type === Step) {
      return {
        title: child.props.title,
        content: child.props.children,
      };
    }
    return null;
  }).filter(Boolean);

  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div style={{ maxWidth: '900px', margin: '0' }}>
      {/* Step Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => setCurrentStep(index)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor:
                  index === currentStep
                    ? 'rgb(33, 92, 102)'
                    : index < currentStep
                    ? 'rgb(33, 92, 102)'
                    : '#e0e0e0',
                color: index <= currentStep ? '#fff' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              title={step.title}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div
              onClick={() => setCurrentStep(index)}
              style={{
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: index === currentStep ? 'bold' : 'normal',
                color: index === currentStep ? 'rgb(33, 92, 102)' : '#666',
                cursor: 'pointer',
              }}
            >
              {step.title}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor:
                    index < currentStep ? 'rgb(33, 92, 102)' : '#ccc',
                  margin: '0 0.5rem',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>{steps[currentStep].content}</div>
    </div>
  );
}
