import React, { useEffect, useRef, useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Copy, Maximize2, Code, Minimize2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RenderMicroComponent = ({ generatedCode = '', generatedCSS = '' }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const expandedRef = useRef();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const cleanGeneratedCode = () => {
    return generatedCode.replace(/import\s+['"]\.\/.*\.css['"];?/g, '');
  };

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (event) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const renderControls = (
    <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-4 flex items-center justify-between">
      <h3 className="text-white text-lg font-semibold">Component Preview</h3>
      <div className="flex gap-3">
        <button
          onClick={() => setShowEditor((prev) => !prev)}
          className="flex items-center px-3 py-1.5 text-xs text-white rounded hover:bg-white/20 transition"
          title={showEditor ? "Hide code editor panel" : "Show code editor panel"}
        >
          <Code size={16} className="mr-1" />
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center px-3 py-1.5 text-xs text-white rounded hover:bg-white/20 transition"
          title="Copy the generated code to clipboard"
        >
          <Copy size={16} className="mr-1" />
        </button>
        {isExpanded ?
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center px-3 py-1.5 text-sm text-white rounded hover:bg-white/20 transition"
            aria-label="Expand fullscreen"
            disabled={!isExpanded}
            title="Expand preview to fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          :
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center px-3 py-1.5 text-sm text-white rounded hover:bg-white/20 transition"
            aria-label="Expand fullscreen"
            disabled={isExpanded}
            title="Expand preview to fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        }
      </div>
    </div>
  );

  const renderLiveView = (
    <div className={`px-6 py-6 ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
      <div className={`border border-gray-200 rounded-xl bg-gray-50 p-4 ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
        <h4 className="text-sm font-medium text-gray-500 mb-3">Live Output</h4>
        <div className={`rounded-md overflow-hidden ${isExpanded ? 'flex-1' : 'min-h-[300px]'}`}>
          <Sandpack
            template="react"
            theme="light"
            files={{
              '/App.js': cleanGeneratedCode(),
              '/styles.css': generatedCSS,
              '/index.js': `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import './styles.css';
      import App from './App';

      const root = createRoot(document.getElementById('root'));
      root.render(<App />);
    `,
            }}
            customSetup={{
              entry: '/index.js',
              dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
              },
            }}
            options={{
              showTabs: true,
              showLineNumbers: true,
              showNavigator: true,
              resizablePanels: true,
              editorHeight: isExpanded ? '100%' : 320,
              editorWidthPercentage: showEditor ? 45 : 0,
              showEditor: showEditor
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderEditorSidebar = showEditor && (
    <div className="mt-4 space-y-6 border-t pt-6 px-6 bg-gray-50">
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Generated React Code</h4>
        <SyntaxHighlighter language="jsx" style={oneDark}>
          {generatedCode}
        </SyntaxHighlighter>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Generated CSS</h4>
        <SyntaxHighlighter language="css" style={duotoneLight}>
          {generatedCSS || '/* No custom styles generated */'}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  const previewContent = (
    <div className={`border rounded-2xl shadow-lg overflow-hidden bg-white ${isExpanded ? 'w-full h-full max-w-none max-h-none' : ''}`}>
      {renderControls}
      {renderLiveView}
      {renderEditorSidebar}
    </div>
  );

  return (
    <>
      {!isExpanded && previewContent}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            ref={expandedRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] overflow-auto flex flex-col"
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center px-3 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-200 transition"
                aria-label="Close fullscreen"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="ml-1">Close</span>
              </button>
            </div>
            <div className="flex-1 flex flex-col">{previewContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default RenderMicroComponent;
