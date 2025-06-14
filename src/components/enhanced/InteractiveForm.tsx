
import React from 'react';
import { useForm, FieldPath, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export type FormFieldType = 'input' | 'textarea' | 'select' | 'checkbox' | 'email' | 'password' | 'tel' | 'date' | 'time';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  validation?: z.ZodType<any>;
  className?: string;
  disabled?: boolean;
}

export interface InteractiveFormProps<T extends Record<string, any>> {
  fields: FormField[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  submitText?: string;
  submitClassName?: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  children?: React.ReactNode;
}

export function InteractiveForm<T extends Record<string, any>>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = 'Submit',
  submitClassName,
  isLoading = false,
  error,
  className,
  children
}: InteractiveFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  });

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name as keyof T];
    const hasError = !!fieldError;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className={cn('space-y-2', field.className)}>
            <Label htmlFor={field.name} className={hasError ? 'text-red-500' : ''}>
              {field.label} {field.required && '*'}
            </Label>
            <Select
              onValueChange={(value) => setValue(field.name as FieldPath<T>, value)}
              disabled={field.disabled || isSubmitting}
            >
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500">{fieldError?.message as string}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className={cn('space-y-2', field.className)}>
            <Label htmlFor={field.name} className={hasError ? 'text-red-500' : ''}>
              {field.label} {field.required && '*'}
            </Label>
            <Textarea
              id={field.name}
              {...register(field.name as FieldPath<T>)}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
              className={cn(hasError ? 'border-red-500' : '', 'min-h-[80px]')}
            />
            {hasError && (
              <p className="text-sm text-red-500">{fieldError?.message as string}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={cn('flex items-center space-x-2', field.className)}>
            <Checkbox
              id={field.name}
              {...register(field.name as FieldPath<T>)}
              disabled={field.disabled || isSubmitting}
            />
            <Label
              htmlFor={field.name}
              className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', hasError ? 'text-red-500' : '')}
            >
              {field.label} {field.required && '*'}
            </Label>
            {hasError && (
              <p className="text-sm text-red-500 ml-6">{fieldError?.message as string}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className={cn('space-y-2', field.className)}>
            <Label htmlFor={field.name} className={hasError ? 'text-red-500' : ''}>
              {field.label} {field.required && '*'}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'input' ? 'text' : field.type}
              {...register(field.name as FieldPath<T>)}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <p className="text-sm text-red-500">{fieldError?.message as string}</p>
            )}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {fields.map(renderField)}
      
      {children}
      
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className={cn('w-full', submitClassName)}
      >
        {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </form>
  );
}
