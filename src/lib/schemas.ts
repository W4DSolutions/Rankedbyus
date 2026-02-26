import { z } from 'zod';

// UUID Schema Helper
const uuidSchema = z.string().uuid({ message: "Invalid Identifier format" });

// 1. Voting Schema
export const VoteSchema = z.object({
    item_id: uuidSchema,
    value: z.union([
        z.literal(1),
        z.literal(-1),
        z.literal(null)
    ], {
        error: "Signal value must be 1, -1, or null"
    })
});

// 2. Review Schema
export const ReviewSchema = z.object({
    item_id: uuidSchema,
    rating: z.number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    comment: z.string()
        .max(1000, "Signal too long (max 1000 chars)")
        .transform(val => (!val || val.trim() === "") ? null : val.trim())
        .refine(val => val === null || val.length >= 10, {
            message: "Intelligence Signal must be at least 10 characters"
        })
        .nullable()
});

// 3. User Profile Schema
export const ProfileUpdateSchema = z.object({
    displayName: z.string()
        .min(2, "Name too short")
        .max(50, "Name too long")
        .trim()
});

export type VoteInput = z.infer<typeof VoteSchema>;
export type ReviewInput = z.infer<typeof ReviewSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
