package com.bookstore.backend.validators;

import com.bookstore.backend.dtos.request.AdminCreateUserRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.request.UpdateProfileRequest;
import com.bookstore.backend.repositories.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, Object>
{
    private final IUserRepository userRepository;

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context)
    {
        boolean isEmailUnique = true;

        if (value instanceof UpdateProfileRequest request)
        {
            String email = request.getEmail();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated())
            {
                return false;
            }

            String username = auth.getName();

            if (email == null)
            {
                return true;
            }

            isEmailUnique = userRepository.findByEmail(email)
                    .map(user -> user.getUsername().equals(username))
                    .orElse(true);
        }
        else if (value instanceof RegisterRequest request)
        {
            String email = request.getEmail();

            isEmailUnique = email != null && !userRepository.existsByEmail(email);
        }
        else if (value instanceof AdminCreateUserRequest request)
        {
            String email = request.getEmail();

            isEmailUnique = email != null && !userRepository.existsByEmail(email);
        }

        if (!isEmailUnique)
        {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Email adresa je već u upotrebi")
                    .addPropertyNode("email")
                    .addConstraintViolation();
        }

        return isEmailUnique;
    }
}
