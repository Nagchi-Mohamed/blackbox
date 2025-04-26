import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const KatexRenderer = ({ equation }) => {
  const renderEquation = () => {
    try {
      return katex.renderToString(equation, {
        throwOnError: false,
        displayMode: false
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return equation;
    }
  };

  return (
    <span
      className="katex-renderer"
      dangerouslySetInnerHTML={{ __html: renderEquation() }}
    />
  );
}; 