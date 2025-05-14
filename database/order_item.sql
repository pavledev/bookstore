create table order_item
(
    order_item_id int auto_increment
        primary key,
    order_id      int            not null,
    book_id       int            not null,
    quantity      int            not null,
    total_amount  decimal(10, 2) not null,
    constraint fk_order_item_book_id
        foreign key (book_id) references book (book_id),
    constraint fk_order_item_order_id
        foreign key (order_id) references `order` (order_id)
);

