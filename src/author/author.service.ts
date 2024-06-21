import { Injectable, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { Author } from './entity/author.entity'
import { AuthorDto } from './dto/author.dto'
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';

/**
     * Layer to make all author operations in database
 */
@Injectable()
export class AuthorService {
    
    /**
    * @param authorRepository - Author repository to interact with database
    */
    constructor(@InjectRepository(Author) private authorRepository: Repository<Author>) {}

    /**
     * Get all authors found in database
     *
     * @returns An object of type Author found in database
     */
    async findAll(): Promise<Author[]> {
        const authors = await this.authorRepository.find();       
        if(authors.length == 0){
            throw new HttpException(`Authors were not found in database`, HttpStatus.NOT_FOUND)
        }       
        return  authors;
    }

    /**
     * Get a specific author found in database
     *
     * @param id - the author id
     *
     * @returns An object of type Author found in database
     */
    async findAuthor(id: number): Promise<Author> {
        const author = await this.authorRepository.findOne({
            where: { idAutor:id }
        });
        if(!author){            
            throw new HttpException(`Specified author id ${id} was not found`, HttpStatus.NOT_FOUND)
        }
        return author;                
    }

    /**
     * Create a new author in database
     *
     * @param newAuthor - Author object to be inserted in database
     *
     * @returns Author created
     */
    async createAuthor(newAuthor: AuthorDto): Promise<Author> {
        return await this.authorRepository.save(newAuthor);                 
    }

    /**
     * Update information of an existing author in database
     *
     * @param authorId - Author id to be updated
     * @param newAuthor - Author object to be updated in database
     * 
     * @remarks
     * This method validates if author to be updated exists, if not, an exception is thrown
     *
     * @returns Author updated
     */
    async updateAuthor(authorId: number, newAuthor: AuthorDto): Promise<Author> {
        let toUpdate = await this.authorRepository.findOne({where: { idAutor:authorId }}); 
        if(!toUpdate){
            throw new HttpException(`Specified author id ${authorId} was not found`, HttpStatus.NOT_FOUND)
        } 
        let updated = Object.assign(toUpdate, newAuthor); 
        return this.authorRepository.save(updated); 
    }

    /**
     * Delete an existing author in database
     *
     * @param authorId - Author id to be deleted
     * 
     * @remarks
     * This method validates if author to be deleted exists, if not, an exception is thrown
     *
     * @returns response confirmation
     */
    async deleteAuthor(authorId: number): Promise<any> {   
        let toDelete = await this.authorRepository.findOne({where: { idAutor:authorId }}); 
        if(!toDelete){
            throw new HttpException(`Specified author id ${authorId} was not found`, HttpStatus.NOT_FOUND)
        }    
          
        return await this.authorRepository.delete({ idAutor : authorId });        
    }

}
