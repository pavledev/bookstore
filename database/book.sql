create table book
(
    book_id           int auto_increment
        primary key,
    category_id       int            not null,
    publisher_id      int            null,
    title             varchar(255)   not null,
    medium_image_path varchar(255)   not null,
    large_image_path  varchar(255)   not null,
    excerpt_path      varchar(255)   null,
    quantity          int            not null,
    description       text           null,
    publication_year  year           null,
    import_year       year           null,
    binding           varchar(30)    null,
    page_count        int            null,
    script            varchar(10)    null,
    weight            varchar(10)    null,
    unit              varchar(10)    null,
    isbn              varchar(17)    null,
    bar_code          varchar(13)    null,
    import_country    varchar(50)    null,
    age_group         varchar(20)    null,
    format            varchar(50)    null,
    price             decimal(10, 2) not null,
    discount_price    decimal(10, 2) not null,
    constraint fk_book_category_id
        foreign key (category_id) references category (category_id),
    constraint fk_book_publisher_id
        foreign key (publisher_id) references publisher (publisher_id)
);

