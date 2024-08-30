export interface InputProps {
    name: string;
    placeholder?: string;
    value: string | boolean;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    label: string;
    required: boolean;
  }

  export interface ButtonProps {
    text: string;
    className?: string
    onClick: ()=> void
}