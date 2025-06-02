import { Author } from "@/types/author";
import { Genre } from "@/types/genre";
import { Publisher } from "@/types/publisher";
import { Category } from "@/types/category";

export interface Book
{
    bookId: number;
    category: Category;
    publisher: Publisher;

    title: string;
    mediumImagePath: string;
    largeImagePath: string;
    excerptPath: string;
    quantity: number;
    description: string;
    publicationYear: string;
    importYear: string;
    binding: string;
    pageCount: number;
    script: string;
    weight: string;
    unit: string;
    isbn: string;
    barCode: string;
    importCountry: string;
    ageGroup: string;
    format: string;
    price: number;
    discountPrice: number;

    authors: Author[];
    genres: Genre[];
}