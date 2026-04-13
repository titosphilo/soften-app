import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Landing from './Landing';

describe('Landing', () => {
  it('renders the title and terms', () => {
    render(<Landing onAccept={vi.fn()} />);
    expect(screen.getByText('Soften')).toBeInTheDocument();
    expect(screen.getByText(/TERMS AND CONDITIONS/)).toBeInTheDocument();
  });

  it('disables button until unlocked and both checkboxes checked', () => {
    render(<Landing onAccept={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Enter Soften' });
    expect(button).toBeDisabled();
  });

  it('enables button after unlock timer and both checkboxes', async () => {
    vi.useFakeTimers();
    const onAccept = vi.fn();
    render(<Landing onAccept={onAccept} />);

    act(() => vi.advanceTimersByTime(3000));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const button = screen.getByRole('button', { name: 'Enter Soften' });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(onAccept).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('keeps checkboxes disabled before unlock', () => {
    render(<Landing onAccept={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });
});
