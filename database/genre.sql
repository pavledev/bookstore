create table genre
(
    genre_id    int auto_increment
        primary key,
    category_id int         not null,
    name        varchar(50) not null,
    description text        not null,
    constraint fk_genre_category_id
        foreign key (category_id) references category (category_id)
);

