import { Effect } from "effect";
import { InputError } from "./errors.js";
import { ZodObject } from "zod";

export const validateByZodSchema = <T extends ZodObject<any>> (schema: T) => (body: unknown): Effect.Effect<T['_output'], InputError> => {
    const result = schema.safeParse(body)
    if (result.success) {
        return Effect.succeed(result.data)
    } else {
        const { fieldErrors, formErrors } = result.error.flatten()
        if (formErrors && formErrors.length > 0) {
            return Effect.fail(new InputError(formErrors.join(", ")))
        }
        return Effect.fail(new InputError(Object.values(fieldErrors).join(", ")))
    }
}