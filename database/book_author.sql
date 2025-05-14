create table book_author
(
    book_author_id int auto_increment
        primary key,
    book_id        int not null,
    author_id      int not null,
    constraint fk_book_author_author_id
        foreign key (author_id) references author (author_id),
    constraint fk_book_author_book_id
        foreign key (book_id) references book (book_id)
);

