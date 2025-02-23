export function SystemActions({ computer }) {
  const actions = [
    { label: 'Restart', icon: 'arrow-clockwise', action: 'restart' },
    { label: 'Sleep', icon: 'moon', action: 'sleep' },
    { label: 'Lock', icon: 'lock', action: 'lock' },
    { label: 'Update', icon: 'cloud-download', action: 'update' }
  ];

  return (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle">
        Actions
      </button>
      <ul className="dropdown-menu">
        {actions.map(action => (
          <li key={action.action}>
            <button className="dropdown-item">
              <i className={`bi bi-${action.icon} me-2`}></i>
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 