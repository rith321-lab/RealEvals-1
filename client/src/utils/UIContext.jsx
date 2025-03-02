import React, { createContext, useContext, useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { mantineTheme } from './mantineTheme';
import { muiTheme } from './muiTheme';

// Create context
const UIContext = createContext();

// UI framework options
export const UI_FRAMEWORKS = {
  MANTINE: 'mantine',
  MUI: 'mui',
};

export const UIProvider = ({ children }) => {
  // Default to Mantine, but check localStorage for saved preference
  const [activeFramework, setActiveFramework] = useState(UI_FRAMEWORKS.MANTINE);
  
  // Load saved preference on mount
  useEffect(() => {
    const savedFramework = localStorage.getItem('uiFramework');
    if (savedFramework && Object.values(UI_FRAMEWORKS).includes(savedFramework)) {
      setActiveFramework(savedFramework);
    }
  }, []);
  
  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('uiFramework', activeFramework);
  }, [activeFramework]);
  
  // Toggle between frameworks
  const toggleFramework = () => {
    setActiveFramework(prev => 
      prev === UI_FRAMEWORKS.MANTINE ? UI_FRAMEWORKS.MUI : UI_FRAMEWORKS.MANTINE
    );
  };
  
  // Check if a specific framework is active
  const isFramework = (framework) => activeFramework === framework;
  
  // Context value
  const contextValue = {
    activeFramework,
    setActiveFramework,
    toggleFramework,
    isFramework,
    isMantine: activeFramework === UI_FRAMEWORKS.MANTINE,
    isMui: activeFramework === UI_FRAMEWORKS.MUI,
  };
  
  // Wrap with appropriate providers based on active framework
  return (
    <UIContext.Provider value={contextValue}>
      {activeFramework === UI_FRAMEWORKS.MANTINE ? (
        <MantineProvider theme={mantineTheme}>
          {children}
        </MantineProvider>
      ) : (
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      )}
    </UIContext.Provider>
  );
};

// Custom hook to use the UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
