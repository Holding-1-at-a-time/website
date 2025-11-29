'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Validation schema for booking form
const bookingSchema = z.object({
  service: z.string().min(1, 'Service is required'),
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleYear: z.string().min(4, 'Valid vehicle year is required'),
  specialRequests: z.string().optional(),
});

export async function createBooking(formData: FormData) {
  try {
    // Extract form data
    const rawData = {
      service: formData.get('service') as string,
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      preferredDate: formData.get('preferredDate') as string,
      preferredTime: formData.get('preferredTime') as string,
      vehicleMake: formData.get('vehicleMake') as string,
      vehicleModel: formData.get('vehicleModel') as string,
      vehicleYear: formData.get('vehicleYear') as string,
      specialRequests: (formData.get('specialRequests') as string) || undefined,
    };

    // Validate the data
    const validatedData = bookingSchema.parse(rawData);

    // Here you would integrate with your Convex backend
    // For now, we'll simulate the booking creation
    console.log('Creating booking with data:', validatedData);

    // In a real implementation, you would:
    // await db.bookings.create({
    //   data: {
    //     ...validatedData,
    //     status: 'pending',
    //     createdAt: Date.now(),
    //   },
    // });

    // Revalidate relevant pages
    revalidatePath('/booking');
    revalidatePath('/services');
    revalidatePath('/');

    // Redirect to success page
    redirect('/booking/success');

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      const fieldErrors = error.errors.reduce((acc, err) => {
        const field = err.path[0] as string;
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);

      // In a real implementation, you would handle this differently
      // For server actions, you might return the errors or throw them
      throw new Error(`Validation failed: ${JSON.stringify(fieldErrors)}`);
    }
    
    throw new Error('Failed to create booking. Please try again.');
  }
}

export async function updateBookingStatus(bookingId: string, status: string, notes?: string) {
  try {
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    // Here you would update the booking in your database
    console.log(`Updating booking ${bookingId} to status: ${status}`, { notes });

    // Revalidate relevant pages
    revalidatePath('/booking');
    revalidatePath('/admin/bookings');

  } catch (error) {
    throw new Error('Failed to update booking status');
  }
}