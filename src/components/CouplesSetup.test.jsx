import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CouplesSetup from './CouplesSetup';

describe('CouplesSetup', () => {
  it('disables begin button when names are empty', () => {
    render(<CouplesSetup onStart={vi.fn()} onBack={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Begin' });
    expect(button).toBeDisabled();
  });

  it('enables begin button when both names are filled', () => {
    render(<CouplesSetup onStart={vi.fn()} onBack={vi.fn()} />);
    const inputs = screen.getAllByPlaceholderText('First name');
    fireEvent.change(inputs[0], { target: { value: 'Alice' } });
    fireEvent.change(inputs[1], { target: { value: 'Bob' } });

    const button = screen.getByRole('button', { name: 'Begin' });
    expect(button).not.toBeDisabled();
  });

  it('calls onStart with trimmed names on submit', () => {
    const onStart = vi.fn();
    render(<CouplesSetup onStart={onStart} onBack={vi.fn()} />);
    const inputs = screen.getAllByPlaceholderText('First name');
    fireEvent.change(inputs[0], { target: { value: '  Alice  ' } });
    fireEvent.change(inputs[1], { target: { value: '  Bob  ' } });

    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(onStart).toHaveBeenCalledWith('Alice', 'Bob');
  });

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn();
    render(<CouplesSetup onStart={vi.fn()} onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
