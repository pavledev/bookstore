create table payment
(
    payment_id     int auto_increment
        primary key,
    credit_card_id int                                          null,
    payment_method enum ('Platna kartica', 'Plaćanje pouzećem') not null,
    constraint fk_payment_credit_card_id
        foreign key (credit_card_id) references credit_card (credit_card_id)
);

