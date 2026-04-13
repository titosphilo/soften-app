import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders both session options', () => {
    render(<Home onSolo={vi.fn()} onCouples={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Solo Session' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Couples Session' })).toBeInTheDocument();
  });

  it('calls onSolo when solo button clicked', () => {
    const onSolo = vi.fn();
    render(<Home onSolo={onSolo} onCouples={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Solo Session' }));
    expect(onSolo).toHaveBeenCalledOnce();
  });

  it('calls onCouples when couples button clicked', () => {
    const onCouples = vi.fn();
    render(<Home onSolo={vi.fn()} onCouples={onCouples} />);
    fireEvent.click(screen.getByRole('button', { name: 'Couples Session' }));
    expect(onCouples).toHaveBeenCalledOnce();
  });
});
