import { renderHook, act } from '@testing-library/react';
import useAutoSave, { SAVE_STATUS } from '../../src/hooks/useAutoSave';

// Mock timers
jest.useFakeTimers();

describe('useAutoSave', () => {
  let mockSaveFunction;

  beforeEach(() => {
    mockSaveFunction = jest.fn();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  test('should initialize with idle status', () => {
    const { result } = renderHook(() => 
      useAutoSave('test data', mockSaveFunction)
    );

    expect(result.current.saveStatus).toBe(SAVE_STATUS.IDLE);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.isSaved).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test('should debounce save operations', async () => {
    mockSaveFunction.mockResolvedValue(true);
    
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { delay: 1000 }),
      { initialProps: { data: 'initial' } }
    );

    // Change data multiple times quickly
    rerender({ data: 'change1' });
    rerender({ data: 'change2' });
    rerender({ data: 'change3' });

    // Should be pending but not yet saving
    expect(result.current.saveStatus).toBe(SAVE_STATUS.PENDING);
    expect(mockSaveFunction).not.toHaveBeenCalled();

    // Fast-forward time to trigger save
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Should have called save function only once with latest data
    expect(mockSaveFunction).toHaveBeenCalledTimes(1);
    expect(mockSaveFunction).toHaveBeenCalledWith('change3');
  });

  test('should handle successful save', async () => {
    mockSaveFunction.mockResolvedValue(true);
    
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'new data' });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.saveStatus).toBe(SAVE_STATUS.SAVED);
    expect(result.current.isSaved).toBe(true);
    expect(result.current.lastSaved).toBeInstanceOf(Date);
  });

  test('should handle save errors with retry', async () => {
    mockSaveFunction
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(true);
    
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { 
        delay: 1000, 
        maxRetries: 2, 
        retryDelay: 500 
      }),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'new data' });

    // Trigger initial save
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Should be pending retry
    expect(result.current.saveStatus).toBe(SAVE_STATUS.PENDING);
    expect(result.current.retryCount).toBe(1);

    // Trigger retry
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Should succeed on retry
    expect(result.current.saveStatus).toBe(SAVE_STATUS.SAVED);
    expect(mockSaveFunction).toHaveBeenCalledTimes(2);
  });

  test('should provide manual save functionality', async () => {
    mockSaveFunction.mockResolvedValue(true);
    
    const { result } = renderHook(() => 
      useAutoSave('test data', mockSaveFunction)
    );

    await act(async () => {
      const success = await result.current.saveNow();
      expect(success).toBe(true);
    });

    expect(mockSaveFunction).toHaveBeenCalledWith('test data');
    expect(result.current.saveStatus).toBe(SAVE_STATUS.SAVED);
  });

  test('should respect enabled option', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { enabled: false }),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'new data' });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockSaveFunction).not.toHaveBeenCalled();
    expect(result.current.saveStatus).toBe(SAVE_STATUS.IDLE);
  });

  test('should call onSave callback on successful save', async () => {
    const onSave = jest.fn();
    mockSaveFunction.mockResolvedValue(true);
    
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { onSave }),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'new data' });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(onSave).toHaveBeenCalledWith('new data', true);
  });

  test('should call onError callback on save failure', async () => {
    const onError = jest.fn();
    const error = new Error('Save failed');
    mockSaveFunction.mockRejectedValue(error);
    
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { 
        onError, 
        maxRetries: 1 
      }),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'new data' });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(onError).toHaveBeenCalledWith(error, 'new data');
    expect(result.current.saveStatus).toBe(SAVE_STATUS.ERROR);
  });
});