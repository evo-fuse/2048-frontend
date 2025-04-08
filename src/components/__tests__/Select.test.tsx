import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from '../Select';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with placeholder when no value is selected', () => {
    render(
      <Select 
        options={options} 
        value="" 
        onChange={mockOnChange} 
        placeholder="Select something" 
      />
    );
    
    expect(screen.getByText('Select something')).toBeInTheDocument();
  });

  test('renders with selected value', () => {
    render(
      <Select 
        options={options} 
        value="option2" 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('opens dropdown when clicked', () => {
    render(
      <Select 
        options={options} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Dropdown should be closed initially
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    
    // All options should be visible
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  test('selects an option when clicked', async () => {
    render(
      <Select 
        options={options} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    
    // Click an option
    fireEvent.click(screen.getByText('Option 2'));
    
    // Should call onChange with the selected value
    expect(mockOnChange).toHaveBeenCalledWith('option2');
    
    // Dropdown should close
    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  test('does not open dropdown when disabled', () => {
    render(
      <Select 
        options={options} 
        value="" 
        onChange={mockOnChange} 
        disabled={true}
      />
    );
    
    // Click should not open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
}); 