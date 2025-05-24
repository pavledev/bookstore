package com.bookstore.backend.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordMatches
{
    String message() default "Lozinke se ne podudaraju";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
