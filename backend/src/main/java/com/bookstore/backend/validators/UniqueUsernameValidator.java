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
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, Object>
{
    private final IUserRepository userRepository;

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context)
    {
        boolean isUsernameUnique = true;

        if (value instanceof UpdateProfileRequest request)
        {
            String newUsername = request.getUsername();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (newUsername == null || auth == null || !auth.isAuthenticated())
            {
                return true;
            }

            String currentUsername = auth.getName();

            isUsernameUnique = userRepository.findByUsername(newUsername)
                    .map(user -> user.getUsername().equals(currentUsername))
                    .orElse(true);
        }
        else if (value instanceof RegisterRequest request)
        {
            String username = request.getUsername();

            isUsernameUnique = username != null && !userRepository.existsByUsername(username);
        }
        else if (value instanceof AdminCreateUserRequest request)
        {
            String username = request.getUsername();

            isUsernameUnique = username != null && !userRepository.existsByUsername(username);
        }

        if (!isUsernameUnique)
        {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Korisničko ime je već u upotrebi")
                    .addPropertyNode("username")
                    .addConstraintViolation();
        }

        return isUsernameUnique;
    }
}
