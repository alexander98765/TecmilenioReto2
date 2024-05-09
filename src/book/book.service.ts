import { Injectable,  HttpStatus, HttpException } from '@nestjs/common';
import { Book } from './book.entity'
import { BookDto } from './book.dto'
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { AuthorService } from '../author/author.service';

@Injectable()
export class BookService {

    /**
    * @param bookRepository - Book repository to interact with database
    * @param authorService - Author repository to interact with database
    */
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>,
                private authorService: AuthorService) {}

    /**
     * Get all books found in database
     *
     * @returns An array of type Book found in database
     */
    async findAll(): Promise<Book[]>{
        const books = await this.bookRepository.find({
            relations: {
                author: true
            }
        })        
        if(books.length == 0){
            throw new HttpException(`Books were not found in database`, HttpStatus.NOT_FOUND)
        }
        return books;                 
    }

    /**
     * Get a specific book found in database
     *
     * @param bookId - the book id
     *
     * @returns An object of type Book found in database
     */
    async findBook(bookId:number): Promise<Book>{
        const book = await this.bookRepository.findOne({
            where: { idLibro:bookId }
        });
        if(!book){
            throw new HttpException(`Specified book id ${bookId} was not found`, HttpStatus.NOT_FOUND)
        }
        return book;        
    }

    /**
     * Create a new book in databasd
     *
     * @param book - Author object to be inserted in database
     *
     * @returns Book created
     */
    async createBook(book: BookDto): Promise<Book>{
        const authorFound = await this.authorService.findAuthor(book.idAutor)
        if(!authorFound){
            throw new HttpException('Author not found', HttpStatus.NOT_FOUND)
        }
        const newBook = this.bookRepository.create(book);
        return this.bookRepository.save(newBook);                   
    }

    /**
     * Delete an existing book in databasd
     *
     * @param bookId - Book id to be deleted
     *
     * @returns response confirmation
     */
    async deleteBook(bookId: number) {
        let toDelete = await this.bookRepository.findOne({where: { idLibro:bookId }}); 
        if(!toDelete){
            throw new HttpException(`Specified book id ${bookId} was not found`, HttpStatus.NOT_FOUND)
        }
        return await this.bookRepository.delete({ idLibro : bookId });                 
    }

    /**
     * Update information of an existing book in databasd
     *
     * @param bookId - Book id to be updated
     * @param newBook - Book object to be updated in database
     *
     * @returns Book updated
     */
    async updateBook(bookId: number, newBook: BookDto) {     
        let toUpdate = await this.bookRepository.findOne({where: { idLibro:bookId }}); 
        if(!toUpdate){
            throw new HttpException(`Specified book id ${bookId} was not found`, HttpStatus.NOT_FOUND)
        } 
        let updated = Object.assign(toUpdate, newBook); 
        return this.bookRepository.save(updated);
    }

}
