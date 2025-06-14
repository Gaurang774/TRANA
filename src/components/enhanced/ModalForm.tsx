
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InteractiveForm, FormField } from './InteractiveForm';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

export interface ModalFormProps<T extends Record<string, any>> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  fields: FormField[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
  submitText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ModalForm<T extends Record<string, any>>({
  trigger,
  title,
  description,
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = 'Submit',
  open,
  onOpenChange,
  className
}: ModalFormProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const modalOpen = isControlled ? open : isOpen;
  const setModalOpen = isControlled ? onOpenChange : setIsOpen;

  const handleSubmit = async (data: T) => {
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
      setModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <InteractiveForm
          fields={fields}
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText={submitText}
          isLoading={isLoading}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
