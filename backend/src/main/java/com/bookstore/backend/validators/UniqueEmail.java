package com.bookstore.backend.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
@Documented
public @interface UniqueEmail
{
    String message() default "Email adresa je već u upotrebi";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
