create table user
(
    user_id       int auto_increment
        primary key,
    username      varchar(50)  not null,
    email         varchar(255) not null,
    password_hash varchar(255) not null,
    first_name    varchar(50)  not null,
    last_name     varchar(50)  not null,
    phone_number  varchar(20)  not null,
    city          varchar(50)  not null,
    street_name   varchar(50)  not null,
    street_number varchar(5)   not null
);

