create table book_genre
(
    book_genre_id int auto_increment
        primary key,
    book_id       int not null,
    genre_id      int not null,
    constraint fk_book_genre_book_id
        foreign key (book_id) references book (book_id),
    constraint fk_book_genre_genre_id
        foreign key (genre_id) references genre (genre_id)
);

