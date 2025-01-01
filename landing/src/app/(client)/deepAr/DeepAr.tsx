'use client';
import React, { useEffect, useRef } from 'react';
import * as deepar from 'deepar';

const DeepARComponent = ({ licenseKey }) => {
  const previewRef = useRef(null);
  const deepARInstanceRef = useRef(null); // Ref to track the DeepAR instance

  useEffect(() => {
    let isInitializing = false; // Track initialization state

    const initializeDeepAR = async () => {
      if (isInitializing || deepARInstanceRef.current) return; // Prevent multiple initializations
      isInitializing = true;

      try {
        const deepAR = await deepar.initialize({
          licenseKey,
          previewElement: previewRef.current,
          effect: 'effects/ray-ban-wayfarer.deepar', // Default effect
          rootPath: './deepar-resources', // Adjust path as needed
        });

        deepARInstanceRef.current = deepAR; // Store instance for cleanup
        isInitializing = false;
      } catch (error) {
        console.error('DeepAR initialization error:', error);
        isInitializing = false;
      }
    };

    initializeDeepAR();

    return () => {
      // Cleanup on unmount or re-render
      if (deepARInstanceRef.current) {
        deepARInstanceRef.current.destroy();
        deepARInstanceRef.current = null;
      }
    };
  }, [licenseKey]); // Re-run only if the licenseKey changes

  return (
    <div
      id="ar-screen"
      ref={previewRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default DeepARComponent;
