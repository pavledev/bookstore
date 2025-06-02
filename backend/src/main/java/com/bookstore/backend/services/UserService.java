package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.*;
import com.bookstore.backend.entities.Role;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.mappers.UserMapper;
import com.bookstore.backend.models.UserModel;
import com.bookstore.backend.repositories.IRoleRepository;
import com.bookstore.backend.repositories.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService
{
    private final PasswordEncoder passwordEncoder;

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserModel> getUsers(PageRequest pageRequest)
    {
        Page<User> userPage = userRepository.findByIsDeletedFalse(pageRequest);

        return userMapper.toModelPage(userPage);
    }

    @Override
    public UserModel getCurrentUser()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return userMapper.toModel(user);
    }

    @Override
    public UserModel getUserById(Integer userId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        return userMapper.toModel(user);
    }

    @Override
    public Page<UserModel> filterUsers(UserFilterRequest filter, PageRequest pageRequest)
    {
        Specification<User> spec = Specification.where(null);

        if (filter.getQuery() != null && !filter.getQuery().isBlank())
        {
            String keyword = "%" + filter.getQuery().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("username")), keyword),
                    cb.like(cb.lower(root.get("email")), keyword),
                    cb.like(cb.lower(root.get("firstName")), keyword),
                    cb.like(cb.lower(root.get("lastName")), keyword)
            ));
        }

        spec = spec.and((root, query, cb) -> cb.isFalse(root.get("isDeleted")));

        Page<User> page = userRepository.findAll(spec, pageRequest);

        return userMapper.toModelPage(page);
    }

    @Override
    public void createUser(RegisterRequest registerRequest)
    {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));

        User user = new User();

        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setCity(registerRequest.getCity());
        user.setStreetName(registerRequest.getStreetName());
        user.setStreetNumber(registerRequest.getStreetNumber());
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
    }

    @Override
    public void createUser(AdminCreateUserRequest adminCreateUserRequest)
    {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin role not found."));

        User user = new User();

        user.setUsername(adminCreateUserRequest.getUsername());
        user.setEmail(adminCreateUserRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(adminCreateUserRequest.getPassword()));
        user.setFirstName(adminCreateUserRequest.getFirstName());
        user.setLastName(adminCreateUserRequest.getLastName());
        user.setPhoneNumber(adminCreateUserRequest.getPhoneNumber());
        user.setCity(adminCreateUserRequest.getCity());
        user.setStreetName(adminCreateUserRequest.getStreetName());
        user.setStreetNumber(adminCreateUserRequest.getStreetNumber());

        if (adminCreateUserRequest.getIsAdmin())
        {
            user.setRoles(Set.of(userRole, adminRole));
        }
        else
        {
            user.setRoles(Set.of(userRole));
        }

        userRepository.save(user);
    }

    @Override
    public void updateProfile(UpdateProfileRequest updateProfileRequest)
    {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        user.setUsername(updateProfileRequest.getUsername());
        user.setEmail(updateProfileRequest.getEmail());
        user.setFirstName(updateProfileRequest.getFirstName());
        user.setLastName(updateProfileRequest.getLastName());
        user.setPhoneNumber(updateProfileRequest.getPhoneNumber());
        user.setCity(updateProfileRequest.getCity());
        user.setStreetName(updateProfileRequest.getStreetName());
        user.setStreetNumber(updateProfileRequest.getStreetNumber());

        userRepository.save(user);
    }

    @Override
    public void updateProfile(Integer userId, AdminUpdateProfileRequest adminUpdateProfileRequest)
    {
        Map<String, String> errors = new HashMap<>();

        String newUsername = adminUpdateProfileRequest.getUsername();
        String newEmail = adminUpdateProfileRequest.getEmail();

        userRepository.findByUsername(newUsername).ifPresent(user ->
        {
            if (!user.getUserId().equals(userId))
            {
                errors.put("username", "Korisničko ime je već u upotrebi.");
            }
        });

        userRepository.findByEmail(newEmail).ifPresent(user ->
        {
            if (!user.getUserId().equals(userId))
            {
                errors.put("email", "Email adresa je već u upotrebi.");
            }
        });

        if (!errors.isEmpty())
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errors.toString());
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin role not found."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        user.setUsername(adminUpdateProfileRequest.getUsername());
        user.setEmail(adminUpdateProfileRequest.getEmail());
        user.setFirstName(adminUpdateProfileRequest.getFirstName());
        user.setLastName(adminUpdateProfileRequest.getLastName());
        user.setPhoneNumber(adminUpdateProfileRequest.getPhoneNumber());
        user.setCity(adminUpdateProfileRequest.getCity());
        user.setStreetName(adminUpdateProfileRequest.getStreetName());
        user.setStreetNumber(adminUpdateProfileRequest.getStreetNumber());

        if (adminUpdateProfileRequest.getIsAdmin())
        {
            user.setRoles(new HashSet<>(Arrays.asList(userRole, adminRole)));
        }
        else
        {
            user.setRoles(new HashSet<>(Collections.singletonList(userRole)));
        }

        userRepository.save(user);
    }

    @Override
    public void updatePassword(UpdatePasswordRequest updatePasswordRequest)
    {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(updatePasswordRequest.getPassword()));

        userRepository.save(user);
    }

    @Override
    public void updatePassword(Integer userId, UpdatePasswordRequest updatePasswordRequest)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(updatePasswordRequest.getPassword()));

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Integer userId)
    {
        userRepository.softDeleteById(userId);
    }
}
