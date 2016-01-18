package mk.finki.wp.service;

import java.util.List;

import mk.finki.wp.model.Author;
import mk.finki.wp.model.Book;
import mk.finki.wp.model.Genre;

public interface BookService {
	public Book saveOrUpdateBook(Book entity);
	public Book createBook(String title,String description,String image);
	public Book findBookById(Long id);
	public List<Book> findAllBooks();
	public List<Book> findAllBooksByAuthor(Author author);
	public List<Book> findAllBooksByGenre(Genre genre);
		//add Author and Genre
	public Book setAuthor(Book book, Author author);
	public Book addGenre(Book book, Genre genre);
}
