package com.bookstore.backend.validators;

import com.bookstore.backend.dtos.request.AdminCreateUserRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.request.UpdatePasswordRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object>
{
    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context)
    {
        boolean matches = false;

        if (value instanceof UpdatePasswordRequest request)
        {
            matches = request.getPassword().equals(request.getConfirmPassword());
        }
        else if (value instanceof RegisterRequest request)
        {
            matches = request.getPassword().equals(request.getConfirmPassword());
        }
        else if (value instanceof AdminCreateUserRequest request)
        {
            matches = request.getPassword().equals(request.getConfirmPassword());
        }

        if (!matches)
        {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Lozinke se ne poklapaju")
                    .addPropertyNode("confirmPassword")
                    .addConstraintViolation();
        }

        return matches;
    }
}
