import { Injectable,  HttpStatus, HttpException } from '@nestjs/common';
import { Book } from './entity/book.entity'
import { BookDto } from './dto/book.dto'
import { InjectRepository } from '@nestjs/typeorm'; 
import { Like, Repository } from 'typeorm';
import { AuthorService } from '../author/author.service';

/**
     * Layer to make all book operations in database
 */
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
     * Get a specific book found in database by name
     *
     * @param name - the book name
     *
     * @returns An object of type Book found in database
     */
    async findBookByName(bookName:string): Promise<Book[]>{
        const books = await this.bookRepository.find({
            where: { nombre: Like(`%${bookName}%`) }
        });
        if(!books){
            throw new HttpException(`Specified book name ${bookName} was not found`, HttpStatus.NOT_FOUND)
        }
        return books;        
    }

    /**
     * Get a specific book found in database by genre
     *
     * @param genre - the book genre
     *
     * @returns An object of type Book found in database
     */
    async findBookByGenre(genre:string): Promise<Book[]>{
        const books = await this.bookRepository.find({
            where: { genero: Like(`%${genre}%`) }
        });
        if(!books){
            throw new HttpException(`Specified book genre ${genre} was not found`, HttpStatus.NOT_FOUND)
        }
        return books;        
    }

    /**
     * Create a new book in database
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
     * @remarks
     * The method validates if book to delete exists, if not, an exception is thrown
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
     * @remarks
     * The method validates if book to update exists, if not, an exception is thrown
     * The method validates if author related to book exists, if not, an exception is thrown
     * 
     * @returns Book updated
     */
    async updateBook(bookId: number, newBook: BookDto) {     
        let toUpdate = await this.bookRepository.findOne({where: { idLibro:bookId }}); 
        if(!toUpdate){
            throw new HttpException(`Specified book id ${bookId} was not found`, HttpStatus.NOT_FOUND)
        } 
        const authorFound = await this.authorService.findAuthor(newBook.idAutor)
        if(!authorFound){
            throw new HttpException('Author was not found', HttpStatus.NOT_FOUND)
        }
        let updated = Object.assign(toUpdate, newBook); 
        return this.bookRepository.save(updated);
    }

}
