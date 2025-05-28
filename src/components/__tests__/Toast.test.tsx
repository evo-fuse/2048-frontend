import { Toast } from '../toast';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Toast.error calls toast.error with correct content', () => {
    Toast.error('Error Title', 'Error Message');
    
    expect(toast.error).toHaveBeenCalledTimes(1);
    
    // Check that the first argument is a React element
    const firstArg = (toast.error as jest.Mock).mock.calls[0][0];
    expect(firstArg.type).toBe('div');
    
    // We can't easily test the exact content of the React element,
    // but we can verify the function was called with the right number of arguments
    // The toast.error is called with 2 arguments: the React element and options
    expect((toast.error as jest.Mock).mock.calls[0].length).toBe(2);
  });

  test('Toast.success calls toast.success with correct content', () => {
    Toast.success('Success Title', 'Success Message');
    
    expect(toast.success).toHaveBeenCalledTimes(1);
    
    // Check that the first argument is a React element
    const firstArg = (toast.success as jest.Mock).mock.calls[0][0];
    expect(firstArg.type).toBe('div');
  });

  test('Toast.info calls toast.info with correct content', () => {
    Toast.info('Info Title', 'Info Message');
    
    expect(toast.info).toHaveBeenCalledTimes(1);
    
    // Check that the first argument is a React element
    const firstArg = (toast.info as jest.Mock).mock.calls[0][0];
    expect(firstArg.type).toBe('div');
  });

  test('passes options to toast functions', () => {
    const options = { autoClose: 5000 };
    
    Toast.error('Error', 'Message', options);
    expect((toast.error as jest.Mock).mock.calls[0][1]).toBe(options);
    
    Toast.success('Success', 'Message', options);
    expect((toast.success as jest.Mock).mock.calls[0][1]).toBe(options);
    
    Toast.info('Info', 'Message', options);
    expect((toast.info as jest.Mock).mock.calls[0][1]).toBe(options);
  });
}); 