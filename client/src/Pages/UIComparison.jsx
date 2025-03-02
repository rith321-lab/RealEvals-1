import React, { useState } from 'react';
import { useUI, UI_FRAMEWORKS } from '../utils/UIContext';
import { FiToggleLeft, FiToggleRight, FiInfo, FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

// Import Mantine components
import * as MantineUI from '../components/ui-mantine';

// Import MUI components
import * as MuiUI from '../components/ui-mui';

const UIComparison = () => {
  const { activeFramework, toggleFramework, isMantine, isMui } = useUI();
  
  // State for form inputs
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  
  // Toggle between frameworks
  const handleToggleFramework = () => {
    toggleFramework();
  };
  
  // Get the active UI components
  const UI = isMantine ? MantineUI : MuiUI;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">UI Framework Comparison</h1>
          
          <button
            onClick={handleToggleFramework}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isMantine ? <FiToggleLeft className="text-primary-600" /> : <FiToggleRight className="text-primary-600" />}
            <span className="font-medium">
              {isMantine ? 'Using Mantine UI' : 'Using MUI Core'}
            </span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Currently Active: {isMantine ? 'Mantine UI' : 'MUI Core'}</h2>
          <p className="text-gray-600 mb-4">
            This page demonstrates the implementation of UI components using both Mantine and MUI Core.
            Toggle between the two frameworks to compare their look and feel.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <UI.Button onClick={handleToggleFramework}>
              Switch to {isMantine ? 'MUI Core' : 'Mantine UI'}
            </UI.Button>
            
            <UI.Badge variant="primary">Primary</UI.Badge>
            <UI.Badge variant="secondary">Secondary</UI.Badge>
            <UI.Badge variant="success">Success</UI.Badge>
            <UI.Badge variant="warning">Warning</UI.Badge>
            <UI.Badge variant="danger">Danger</UI.Badge>
          </div>
        </div>
        
        {/* Button Showcase */}
        <UI.Card className="mb-8">
          <UI.CardHeader>
            <UI.CardTitle>Buttons</UI.CardTitle>
            <UI.CardDescription>Various button styles and variants</UI.CardDescription>
          </UI.CardHeader>
          
          <UI.CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Primary</h3>
                <UI.Button variant="primary">Primary Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Secondary</h3>
                <UI.Button variant="secondary">Secondary Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Outline</h3>
                <UI.Button variant="outline">Outline Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Ghost</h3>
                <UI.Button variant="ghost">Ghost Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Link</h3>
                <UI.Button variant="link">Link Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Danger</h3>
                <UI.Button variant="danger">Danger Button</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">With Icon</h3>
                <UI.Button variant="primary" leftIcon={<FiInfo />}>With Icon</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Loading</h3>
                <UI.Button variant="primary" isLoading={true}>Loading</UI.Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-gray-700">Disabled</h3>
                <UI.Button variant="primary" disabled>Disabled</UI.Button>
              </div>
            </div>
          </UI.CardContent>
        </UI.Card>
        
        {/* Card Showcase */}
        <UI.Card className="mb-8">
          <UI.CardHeader>
            <UI.CardTitle>Cards</UI.CardTitle>
            <UI.CardDescription>Various card styles and variants</UI.CardDescription>
          </UI.CardHeader>
          
          <UI.CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UI.Card variant="default">
                <UI.CardHeader>
                  <UI.CardTitle>Default Card</UI.CardTitle>
                  <UI.CardDescription>This is a default card</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <p className="text-gray-600">
                    Cards are used to group related content and actions. They can contain various elements like text, buttons, and images.
                  </p>
                </UI.CardContent>
                <UI.CardFooter>
                  <UI.Button variant="primary" size="sm">Action</UI.Button>
                </UI.CardFooter>
              </UI.Card>
              
              <UI.Card variant="elevated">
                <UI.CardHeader>
                  <UI.CardTitle>Elevated Card</UI.CardTitle>
                  <UI.CardDescription>This is an elevated card</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <p className="text-gray-600">
                    Elevated cards have a higher shadow to create a sense of hierarchy and importance.
                  </p>
                </UI.CardContent>
                <UI.CardFooter>
                  <UI.Button variant="primary" size="sm">Action</UI.Button>
                </UI.CardFooter>
              </UI.Card>
              
              <UI.Card variant="outline">
                <UI.CardHeader>
                  <UI.CardTitle>Outline Card</UI.CardTitle>
                  <UI.CardDescription>This is an outline card</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <p className="text-gray-600">
                    Outline cards have a border instead of a shadow, creating a more subtle appearance.
                  </p>
                </UI.CardContent>
                <UI.CardFooter>
                  <UI.Button variant="primary" size="sm">Action</UI.Button>
                </UI.CardFooter>
              </UI.Card>
              
              <UI.Card variant="filled">
                <UI.CardHeader>
                  <UI.CardTitle>Filled Card</UI.CardTitle>
                  <UI.CardDescription>This is a filled card</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardContent>
                  <p className="text-gray-600">
                    Filled cards have a background color to create visual distinction.
                  </p>
                </UI.CardContent>
                <UI.CardFooter>
                  <UI.Button variant="primary" size="sm">Action</UI.Button>
                </UI.CardFooter>
              </UI.Card>
            </div>
          </UI.CardContent>
        </UI.Card>
        
        {/* Form Elements Showcase */}
        <UI.Card className="mb-8">
          <UI.CardHeader>
            <UI.CardTitle>Form Elements</UI.CardTitle>
            <UI.CardDescription>Various form elements and states</UI.CardDescription>
          </UI.CardHeader>
          
          <UI.CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <UI.Input
                  label="Default Input"
                  placeholder="Enter some text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <UI.Input
                  label="Input with Helper Text"
                  placeholder="Enter some text"
                  helperText="This is some helper text"
                />
                
                <UI.Input
                  label="Required Input"
                  placeholder="Enter some text"
                  required
                />
                
                <UI.Input
                  label="Disabled Input"
                  placeholder="Enter some text"
                  disabled
                />
              </div>
              
              <div className="space-y-4">
                <UI.Input
                  label="Input with Error"
                  placeholder="Enter some text"
                  error="This field is required"
                />
                
                <UI.Input
                  label="Password Input"
                  type="password"
                  placeholder="Enter your password"
                />
                
                <UI.Input
                  label="Input with Icon"
                  placeholder="Search..."
                  startAdornment={<FiInfo />}
                />
                
                <div className="flex gap-4">
                  <UI.Button 
                    variant="primary"
                    onClick={() => setHasError(!hasError)}
                  >
                    Toggle Error
                  </UI.Button>
                  
                  <UI.Button 
                    variant="secondary"
                    onClick={() => setInputValue('')}
                  >
                    Clear Input
                  </UI.Button>
                </div>
              </div>
            </div>
          </UI.CardContent>
        </UI.Card>
        
        {/* Badge Showcase */}
        <UI.Card className="mb-8">
          <UI.CardHeader>
            <UI.CardTitle>Badges</UI.CardTitle>
            <UI.CardDescription>Various badge styles and variants</UI.CardDescription>
          </UI.CardHeader>
          
          <UI.CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Primary</span>
                <UI.Badge variant="primary">Primary</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Secondary</span>
                <UI.Badge variant="secondary">Secondary</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Success</span>
                <UI.Badge variant="success">Success</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Warning</span>
                <UI.Badge variant="warning">Warning</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Danger</span>
                <UI.Badge variant="danger">Danger</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Info</span>
                <UI.Badge variant="info">Info</UI.Badge>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Small</span>
                <UI.Badge variant="primary" size="sm">Small</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Medium</span>
                <UI.Badge variant="primary" size="md">Medium</UI.Badge>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Large</span>
                <UI.Badge variant="primary" size="lg">Large</UI.Badge>
              </div>
            </div>
          </UI.CardContent>
        </UI.Card>
        
        {/* Framework Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Mantine UI</UI.CardTitle>
              <UI.CardDescription>A fully featured React components library</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <p className="text-gray-600 mb-4">
                Mantine is a React components library with a focus on usability, accessibility, and developer experience.
                It provides a set of accessible and customizable components that you can use to build modern web applications.
              </p>
              <div className="flex gap-2">
                <UI.Badge variant="primary">Modern</UI.Badge>
                <UI.Badge variant="secondary">Accessible</UI.Badge>
                <UI.Badge variant="success">Customizable</UI.Badge>
              </div>
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Button 
                variant="outline"
                as="a"
                href="https://mantine.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </UI.Button>
            </UI.CardFooter>
          </UI.Card>
          
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>MUI Core</UI.CardTitle>
              <UI.CardDescription>React components for faster and easier web development</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <p className="text-gray-600 mb-4">
                MUI Core is a popular React UI framework that implements Google's Material Design.
                It's comprehensive and can be used in production out of the box, with a wide range of components.
              </p>
              <div className="flex gap-2">
                <UI.Badge variant="primary">Material Design</UI.Badge>
                <UI.Badge variant="secondary">Popular</UI.Badge>
                <UI.Badge variant="success">Comprehensive</UI.Badge>
              </div>
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Button 
                variant="outline"
                as="a"
                href="https://mui.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </UI.Button>
            </UI.CardFooter>
          </UI.Card>
        </div>
      </div>
    </div>
  );
};

export default UIComparison;
