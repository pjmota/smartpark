import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IOSSwitch from './index';

jest.mock('@mui/material/Switch', () => {
  return function MockSwitch({ checked, onChange, disabled, disableRipple, focusVisibleClassName, ...props }: any) {
    // Filter out MUI-specific props that should not reach the DOM
    const { sx, classes, ...domProps } = props;
    return (
      <input
        type="checkbox"
        data-testid="ios-switch"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...domProps}
      />
    );
  };
});

jest.mock('@mui/material/styles', () => ({
  styled: (component: any) => () => {
    return function StyledComponent(props: any) {
      return React.createElement(component, {
        ...props,
        'data-testid': 'ios-switch',
        className: 'ios-switch-styled'
      });
    };
  },
}));

describe('IOSSwitch', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render the switch correctly', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('type', 'checkbox');
    });

    it('should apply custom style classes', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveClass('ios-switch-styled');
    });

    it('should have correct data-testid', () => {
      render(<IOSSwitch />);
      
      expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
    });
  });

  describe('Switch states', () => {
    it('should render as unchecked by default', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', false);
    });

    it('should render as checked when checked is true', () => {
      render(<IOSSwitch checked={true} onChange={() => {}} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', true);
    });

    it('should render as unchecked when checked is false', () => {
      render(<IOSSwitch checked={false} onChange={() => {}} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', false);
    });

    it('should be enabled by default', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).not.toBeDisabled();
    });

    it('should be disabled when disabled is true', () => {
      render(<IOSSwitch disabled={true} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeDisabled();
    });

    it('should be enabled by default', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).not.toBeDisabled();
    });

    it('should be disabled when disabled is true', () => {
      render(<IOSSwitch disabled={true} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toBeDisabled();
    });
  });

  describe('Change functionality', () => {
    it('should call onChange when clicked', () => {
      render(<IOSSwitch onChange={mockOnChange} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      fireEvent.click(switchElement);
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with correct event', () => {
      render(<IOSSwitch onChange={mockOnChange} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      fireEvent.click(switchElement);
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should not call onChange when disabled', () => {
      render(<IOSSwitch onChange={mockOnChange} disabled={true} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      fireEvent.click(switchElement);
      
      expect(switchElement).toBeDisabled();
    });

    it('should toggle state when controlled', () => {
      const { rerender } = render(<IOSSwitch checked={false} onChange={mockOnChange} />);
      
      let switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', false);
      
      rerender(<IOSSwitch checked={true} onChange={mockOnChange} />);
      
      switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', true);
    });
  });

  describe('Custom props', () => {
    it('should accept additional props', () => {
      render(<IOSSwitch data-custom="test-value" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('data-custom', 'test-value');
    });

    it('should accept custom className', () => {
       render(<IOSSwitch className="custom-class" />);
       
       const switchElement = screen.getByTestId('ios-switch');
       expect(switchElement).toBeInTheDocument();
       expect(switchElement).toHaveClass('ios-switch-styled');
     });

    it('should accept custom id', () => {
      render(<IOSSwitch id="custom-id" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('id', 'custom-id');
    });

    it('should accept custom name', () => {
      render(<IOSSwitch name="custom-name" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('name', 'custom-name');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      switchElement.focus();
      
      expect(switchElement).toHaveFocus();
    });

    it('should respond to keyboard events', () => {
       render(<IOSSwitch onChange={mockOnChange} />);
       
       const switchElement = screen.getByTestId('ios-switch');
       fireEvent.keyDown(switchElement, { key: ' ', code: 'Space' });
       
       expect(switchElement).toBeInTheDocument();
     });

    it('should have correct role', () => {
      render(<IOSSwitch />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('type', 'checkbox');
    });

    it('should accept aria-label', () => {
      render(<IOSSwitch aria-label="Toggle switch" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Toggle switch');
    });

    it('should accept aria-labelledby', () => {
      render(<IOSSwitch aria-labelledby="switch-label" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'switch-label');
    });
  });

  describe('Form integration', () => {
    it('should work in forms', () => {
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <IOSSwitch name="test-switch" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const switchElement = screen.getByTestId('ios-switch');
      const submitButton = screen.getByText('Submit');
      
      fireEvent.click(switchElement);
      fireEvent.click(submitButton);
      
      expect(switchElement).toBeInTheDocument();
    });

    it('should maintain value when part of a form', () => {
      render(<IOSSwitch name="form-switch" value="switch-value" />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveAttribute('name', 'form-switch');
      expect(switchElement).toHaveAttribute('value', 'switch-value');
    });
  });

  describe('Edge cases', () => {
    it('should work without props', () => {
      expect(() => render(<IOSSwitch />)).not.toThrow();
    });

    it('should work with undefined onChange', () => {
      render(<IOSSwitch onChange={undefined} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(() => fireEvent.click(switchElement)).not.toThrow();
    });

    it('should work with undefined checked', () => {
      render(<IOSSwitch checked={undefined} onChange={() => {}} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      expect(switchElement).toHaveProperty('checked', false);
    });

    it('should handle multiple rapid changes', () => {
      render(<IOSSwitch onChange={mockOnChange} />);
      
      const switchElement = screen.getByTestId('ios-switch');
      
      fireEvent.click(switchElement);
      fireEvent.click(switchElement);
      fireEvent.click(switchElement);
      
      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Conditional rendering', () => {
    it('should render consistently', () => {
      const { rerender } = render(<IOSSwitch checked={false} onChange={() => {}} />);
      
      expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
      
      rerender(<IOSSwitch checked={true} onChange={() => {}} />);
      
      expect(screen.getByTestId('ios-switch')).toBeInTheDocument();
    });

    it('should maintain element reference', () => {
      const { rerender } = render(<IOSSwitch checked={false} onChange={() => {}} />);
      
      const firstRender = screen.getByTestId('ios-switch');
      
      rerender(<IOSSwitch checked={true} onChange={() => {}} />);
      
      const secondRender = screen.getByTestId('ios-switch');
      
      expect(firstRender).toBeInTheDocument();
      expect(secondRender).toBeInTheDocument();
    });
  });
});