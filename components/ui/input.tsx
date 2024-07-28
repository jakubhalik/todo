'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, value = '', onChange, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [rows, setRows] = React.useState(
            Math.ceil(String(value).length / 34)
        );

        const calculateRows = (value: string) => {
            const newRows = Math.ceil(value.length / 34);
            setRows(newRows);
        };

        React.useEffect(() => {
            calculateRows(String(value));
        }, [value]);

        const filteredProps = { ...props };
        delete filteredProps.onToggle;

        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            if (onChange) {
                onChange(e as React.ChangeEvent<HTMLInputElement>);
            }
        };

        return (
            <div className="relative">
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                    ref={ref}
                    {...filteredProps}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={handleChange}
                />
                {isFocused && window.innerWidth < 400 && (
                    <div className="fixed top-1/4 left-1/2 w-10/12 -translate-x-1/2 z-50 shadow-lg bg-slate-800 rounded border-ring p-2">
                        <textarea
                            className={cn(
                                'flex w-full rounded-md border border-input bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none',
                                className
                            )}
                            rows={rows}
                            value={value}
                            onInput={(e) =>
                                calculateRows(e.currentTarget.value)
                            }
                            onChange={handleChange}
                        />
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
