import React, { forwardRef } from "react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  id: string;
  label: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightTooltip?: string;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      type = "text",
      name,
      id,
      label,
      required = false,
      leftIcon,
      rightTooltip = "Required!",
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex flex-row items-center mb-3 select-none text-muted-foreground">
        <input
          ref={ref}
          {...props}
          name={name}
          required={required}
          aria-invalid={!!error}
          placeholder=" "
          spellCheck="false"
          autoComplete="off"
          id={id}
          type={type}
          className={`peer text-foreground pl-8 h-[40px] min-h-[40px] pr-[40px] leading-normal appearance-none resize-none box-border text-base w-full block text-left border border-border bg-input rounded-md outline-0 focus-visible:outline-0 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 ${
            error
              ? "border-error focus-visible:border-error focus-visible:ring-error/20"
              : ""
          }`}
        />
        <label
          htmlFor={id}
          className={`cursor-text inline-block z-10 text-sm mb-px font-normal text-start select-none absolute duration-300 transform origin-[0] translate-x-[32px] peer-focus-visible:text-primary peer-focus-visible:translate-x-[8px] peer-[:not(:placeholder-shown)]:translate-x-[8px] peer-focus-visible:translate-y-[-36px] peer-[:not(:placeholder-shown)]:translate-y-[-36px] ${
            error ? "text-error peer-focus-visible:text-error" : ""
          }`}
        >
          {label}
        </label>
        {leftIcon && (
          <span className="select-none pointer-events-none absolute z-[1] left-0 top-0 bottom-0 flex items-center justify-center size-[40px] text-muted-foreground">
            {leftIcon}
          </span>
        )}
        {required && (
          <div className="group w-[40px] absolute top-0 bottom-0 right-0 flex items-center justify-center text-muted-foreground peer-focus-visible:text-primary peer-focus-visible:[&_span]:border-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
            <span className="text-sm absolute cursor-default select-none rounded-sm px-1.5 opacity-0 right-0 -z-10 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-[calc(100%+18px)]">
              {rightTooltip}
            </span>
          </div>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
