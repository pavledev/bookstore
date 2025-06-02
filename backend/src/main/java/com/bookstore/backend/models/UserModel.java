package com.bookstore.backend.models;

import lombok.Data;

import java.util.Set;

@Data
public class UserModel
{
    private Integer userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String city;
    private String streetName;
    private String streetNumber;
    private Set<RoleModel> roles;
}
