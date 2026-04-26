import React from 'react';

export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loader-wrap">
        <div className="spinner" />
      </div>
    );
  }
  return <div className="spinner spinner-sm" style={{ margin: '.5rem auto' }} />;
}
