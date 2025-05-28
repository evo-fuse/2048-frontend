import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput Component', () => {
  test('renders with label', () => {
    render(<PasswordInput label="Password" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  test('renders with error message', () => {
    render(<PasswordInput error="Password is required" />);
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toHaveClass('text-red-500');
  });

  test('passes through HTML input attributes', () => {
    render(
      <PasswordInput 
        placeholder="Enter password" 
        data-testid="password-input"
        required
      />
    );
    
    const input = screen.getByTestId('password-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toHaveAttribute('required');
  });

  test('handles input changes', () => {
    const handleChange = jest.fn();
    render(<PasswordInput onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test-password' } });
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test-password');
  });
}); 