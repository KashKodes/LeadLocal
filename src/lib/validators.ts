import { z } from 'zod';

export const leadSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  zipCode: z.string().min(5),
  serviceType: z.string().min(2),
  dateNeeded: z.string().optional().or(z.literal('')),
  details: z.string().optional(),
  propertyType: z.string().min(2),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
});

export const providerSchema = z.object({
  companyName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  website: z.string().optional(),
  serviceArea: z.string().min(2),
  teamSize: z.string().min(1),
  plan: z.enum(['Starter', 'Growth', 'Exclusive']),
});
