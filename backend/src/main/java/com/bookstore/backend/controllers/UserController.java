package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.*;
import com.bookstore.backend.models.UserModel;
import com.bookstore.backend.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController
{
    private final IUserService userService;

    @GetMapping
    public Page<UserModel> getUsers(Integer pageNumber, Integer pageSize)
    {
        return userService.getUsers(PageRequest.of(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> getUserById(@PathVariable Integer id)
    {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserModel> getCurrentUser()
    {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/filter")
    public Page<UserModel> filterUsers(@RequestBody UserFilterRequest filterRequest)
    {
        PageRequest pageRequest = PageRequest.of(
                filterRequest.getPage() != null ? filterRequest.getPage() - 1 : 0,
                filterRequest.getPerPage() != null ? filterRequest.getPerPage() : 20
        );

        return userService.filterUsers(filterRequest, pageRequest);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest adminCreateUserRequest)
    {
        userService.createUser(adminCreateUserRequest);

        return ResponseEntity.ok(Map.of("message", "Korisnik je uspešno kreiran."));
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest)
    {
        userService.updateProfile(updateProfileRequest);

        return ResponseEntity.ok(Map.of("message", "Profil je uspešno ažuriran."));
    }

    @PatchMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfileByAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody AdminUpdateProfileRequest adminUpdateProfileRequest
    )
    {
        userService.updateProfile(id, adminUpdateProfileRequest);

        return ResponseEntity.ok(Map.of("message", "Profil je uspešno ažuriran."));
    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest)
    {
        userService.updatePassword(updatePasswordRequest);

        return ResponseEntity.ok(Map.of("message", "Lozinka je uspešno ažurirana."));
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePasswordByAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest
    )
    {
        userService.updatePassword(id, updatePasswordRequest);

        return ResponseEntity.ok(Map.of("message", "Lozinka je uspešno ažurirana."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id)
    {
        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of("message", "Korisnik je uspešno obrisan."));
    }
}
