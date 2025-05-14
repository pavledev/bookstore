create table `order`
(
    order_id         int auto_increment
        primary key,
    user_id          int                                   not null,
    payment_id       int                                   not null,
    total_amount     decimal(10, 2)                        not null,
    status           enum ('Plaćeno', 'Otkazano')          not null,
    shipping_address varchar(255)                          not null,
    created_at       timestamp default current_timestamp() not null,
    constraint fk_order_payment_id
        foreign key (payment_id) references payment (payment_id),
    constraint fk_order_user_id
        foreign key (user_id) references user (user_id)
);

