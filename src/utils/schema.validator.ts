import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { fullFormats } from 'ajv-formats/dist/formats';
import type { Resolver, FieldErrors } from 'react-hook-form';

const ajv = new Ajv({
    allErrors: true,
    validateFormats: true,
    messages: true,
    formats: fullFormats,
});

ajvErrors(ajv);

export const schemaResolver = (schema: any, subSchemas?: any[]): Resolver => {
    if (subSchemas) {
        subSchemas.forEach((subSchema) => {
            if (subSchema.$id && !ajv.getSchema(subSchema.$id)) {
                ajv.addSchema(subSchema);
            }
        });
    }

    const validator = ajv.compile(schema);

    return async (values) => {
        const valid = validator(values);

        if (!valid) {
            const errors: FieldErrors = {};

            validator.errors?.forEach((error) => {
                if (error.keyword === 'required') {
                    const fieldName = error.params.missingProperty;
                    errors[fieldName] = {
                        type: 'required',
                        message: `${fieldName} is required`,
                    };
                    return;
                }

                const path = error.instancePath.substring(1);
                if (path) {
                    errors[path] = {
                        type: error.keyword,
                        message: error.message || 'This field is invalid',
                    };
                }
            });

            return {
                values,
                errors,
            };
        }

        return {
            values,
            errors: {},
        };
    };
};
