package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.*;
import com.bookstore.backend.models.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

public interface IUserService
{
    Page<UserModel> getUsers(PageRequest pageRequest);

    UserModel getUserById(Integer userId);

    UserModel getCurrentUser();

    Page<UserModel> filterUsers(UserFilterRequest filter, PageRequest pageRequest);

    void createUser(RegisterRequest registerRequest);

    void createUser(AdminCreateUserRequest adminCreateUserRequest);

    void updateProfile(UpdateProfileRequest updateProfileRequest);

    void updateProfile(Integer userId, AdminUpdateProfileRequest adminUpdateProfileRequest);

    void updatePassword(UpdatePasswordRequest updatePasswordRequest);

    void updatePassword(Integer userId, UpdatePasswordRequest updatePasswordRequest);

    void deleteUser(Integer userId);
}
