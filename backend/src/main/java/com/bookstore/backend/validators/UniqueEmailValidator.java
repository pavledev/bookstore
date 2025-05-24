package com.bookstore.backend.validators;

import com.bookstore.backend.repositories.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String>
{
    private final IUserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context)
    {
        return email != null && !userRepository.existsByEmail(email);
    }
}
