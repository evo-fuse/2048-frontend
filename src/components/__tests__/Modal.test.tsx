import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: { 
      children: React.ReactNode; 
      onClick?: (event: React.MouseEvent) => void;
      [key: string]: any;
    }) => (
      <div onClick={onClick} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  test('renders with title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} showCloseButton={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when clicking outside if closeOnOutsideClick is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={true}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Find the overlay and click it
    const overlays = screen.getAllByTestId('motion-div');
    fireEvent.click(overlays[0]); // The first motion-div is the overlay
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking outside if closeOnOutsideClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={false}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Find the overlay and click it
    const overlays = screen.getAllByTestId('motion-div');
    fireEvent.click(overlays[0]); // The first motion-div is the overlay
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
}); 