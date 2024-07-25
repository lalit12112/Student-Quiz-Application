import React from 'react';

function ToggleBar({ mode, setMode }) {
  return (
    <div>
      <button onClick={() => setMode('teacher')}>Teacher</button>
      <button onClick={() => setMode('student')}>Student</button>
    </div>
  );
}

export default ToggleBar;
