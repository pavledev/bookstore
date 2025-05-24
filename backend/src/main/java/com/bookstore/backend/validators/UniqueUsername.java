package com.bookstore.backend.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueUsernameValidator.class)
@Documented
public @interface UniqueUsername
{
    String message() default "Korisničko ime je već u upotrebi";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
