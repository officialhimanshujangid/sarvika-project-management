import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Global polyfill for findDOMNode to fix React Quill compatibility with React 19
if (typeof window !== 'undefined' && !ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = (instance) => {
    // Handle different React versions and internal structures
    if (instance && instance._reactInternalFiber) {
      return instance._reactInternalFiber.stateNode;
    }
    if (instance && instance._reactInternalInstance) {
      return instance._reactInternalInstance.getHostNode();
    }
    if (instance && instance.getHostNode) {
      return instance.getHostNode();
    }
    if (instance && instance.nodeType) {
      return instance;
    }
    // For React 19, try to find the DOM node through refs
    if (instance && instance.current) {
      return instance.current;
    }
    return null;
  };
}

// React Quill wrapper to handle React 19 compatibility issues
const ReactQuillWrapper = forwardRef(({ value, onChange, modules, ...props }, ref) => {
  const quillRef = useRef(null);
  const [isMounted, setIsMounted] = React.useState(false);

  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor(),
    focus: () => quillRef.current?.focus(),
    blur: () => quillRef.current?.blur(),
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return (
      <div className="border border-[var(--border-color)] rounded-lg p-4 min-h-[200px] flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="react-quill-wrapper">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        {...props}
      />
    </div>
  );
});

ReactQuillWrapper.displayName = 'ReactQuillWrapper';

export default ReactQuillWrapper;
