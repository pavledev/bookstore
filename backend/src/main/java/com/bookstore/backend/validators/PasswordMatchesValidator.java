package com.bookstore.backend.validators;

import com.bookstore.backend.dtos.request.RegisterRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, RegisterRequest>
{
    @Override
    public boolean isValid(RegisterRequest request, ConstraintValidatorContext context)
    {
        boolean matches = request.getPassword().equals(request.getConfirmPassword());

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
