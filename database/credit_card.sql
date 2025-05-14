create table credit_card
(
    credit_card_id   int auto_increment
        primary key,
    user_id          int          not null,
    card_holder_name varchar(255) null,
    card_number      varchar(19)  null,
    expiry_date      date         not null,
    constraint fk_credit_card_user_id
        foreign key (user_id) references user (user_id)
);

