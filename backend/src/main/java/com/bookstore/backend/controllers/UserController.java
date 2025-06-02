package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.*;
import com.bookstore.backend.models.UserModel;
import com.bookstore.backend.services.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "users", description = "Upravljanje korisnicima")
public class UserController
{
    private final IUserService userService;

    @GetMapping
    @Operation(
            summary = "Dobavi sve korisnike",
            description = "Vraća sve korisnike iz sistema u vidu stranica, uz podršku za paginaciju."
    )
    public Page<UserModel> getUsers(Integer pageNumber, Integer pageSize)
    {
        return userService.getUsers(PageRequest.of(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Dobavi korisnika po ID-u",
            description = "Vraća detalje korisnika na osnovu ID-a."
    )
    public ResponseEntity<UserModel> getUserById(@PathVariable Integer id)
    {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/me")
    @Operation(
            summary = "Dobavi trenutnog korisnika",
            description = "Vraća podatke trenutno ulogovanog korisnika."
    )
    public ResponseEntity<UserModel> getCurrentUser()
    {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/filter")
    @Operation(
            summary = "Filtriraj korisnike",
            description = "Filtrira korisnike po imenu, emailu, ulozi, itd."
    )
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
    @Operation(
            summary = "Kreiraj korisnika (admin)",
            description = "Dodaje novog korisnika. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest adminCreateUserRequest)
    {
        userService.createUser(adminCreateUserRequest);

        return ResponseEntity.ok(Map.of("message", "Korisnik je uspešno kreiran."));
    }

    @PatchMapping("/profile")
    @Operation(
            summary = "Ažuriraj sopstveni profil",
            description = "Omogućava korisniku da ažurira sopstvene podatke."
    )
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest)
    {
        userService.updateProfile(updateProfileRequest);

        return ResponseEntity.ok(Map.of("message", "Profil je uspešno ažuriran."));
    }

    @PatchMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Ažuriraj profil korisnika",
            description = "Omogućava ažuriranje podataka korisnika po ID-u. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> updateUserProfileByAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody AdminUpdateProfileRequest adminUpdateProfileRequest
    )
    {
        userService.updateProfile(id, adminUpdateProfileRequest);

        return ResponseEntity.ok(Map.of("message", "Profil je uspešno ažuriran."));
    }

    @PatchMapping("/password")
    @Operation(
            summary = "Promeni lozinku",
            description = "Omogućava korisniku da promeni svoju lozinku."
    )
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest)
    {
        userService.updatePassword(updatePasswordRequest);

        return ResponseEntity.ok(Map.of("message", "Lozinka je uspešno ažurirana."));
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Promeni lozinku korisnika",
            description = "Omogućava promenu lozinke korisnika po ID-u. Samo admin korisnici imaju pristup."
    )
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
    @Operation(
            summary = "Obriši korisnika",
            description = "Briše korisnika po ID-u. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> deleteUser(@PathVariable Integer id)
    {
        userService.deleteUser(id);

        return ResponseEntity.ok(Map.of("message", "Korisnik je uspešno obrisan."));
    }
}
