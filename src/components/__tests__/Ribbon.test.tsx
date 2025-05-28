import { render, screen } from '@testing-library/react';
import { Ribbon } from '../Ribbon';

describe('Ribbon Component', () => {
  test('renders with default props', () => {
    render(<Ribbon />);
    
    const ribbon = screen.getByText('Selected');
    expect(ribbon).toBeInTheDocument();
    expect(ribbon).toHaveClass('bg-red-500');
    
    const ribbonContainer = ribbon.parentElement;
    expect(ribbonContainer).toHaveStyle('top: -8px');
    expect(ribbonContainer).toHaveStyle('left: -8px');
  });

  test('renders with custom title', () => {
    render(<Ribbon title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  test('renders with custom color', () => {
    render(<Ribbon color="blue" />);
    
    const ribbon = screen.getByText('Selected');
    expect(ribbon).toHaveClass('bg-blue-500');
    
    // Check for the corner elements with darker color
    const ribbonContainer = ribbon.parentElement?.parentElement;
    const corners = ribbonContainer?.querySelectorAll('.bg-blue-800');
    expect(corners?.length).toBe(2);
  });

  test('renders with custom position', () => {
    render(<Ribbon top={-10} left={-12} />);
    
    const ribbonContainer = screen.getByText('Selected').parentElement;
    expect(ribbonContainer).toHaveStyle('top: -10px');
    expect(ribbonContainer).toHaveStyle('left: -12px');
  });
}); 