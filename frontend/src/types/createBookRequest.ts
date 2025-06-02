import { Category } from "@/types/category";
import { Publisher } from "@/types/publisher";
import { Author } from "@/types/author";
import { Genre } from "@/types/genre";

export interface CreateBookRequest
{
    category?: Category | null;
    publisher?: Publisher | null;
    title: string;
    mediumImagePath: string;
    largeImagePath: string;
    excerptPath?: string | null;
    quantity: number;
    description?: string | null;
    publicationYear?: string | null;
    importYear?: string | null;
    binding?: string | null;
    pageCount?: number | null;
    script?: string | null;
    weight?: string | null;
    unit?: string | null;
    isbn?: string | null;
    barCode?: string | null;
    importCountry?: string | null;
    ageGroup?: string | null;
    format?: string | null;
    price: number;
    discountPrice: number;
    authors: Author[];
    genres: Genre[];
}
