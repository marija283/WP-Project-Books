package mk.finki.wp.persistance;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import mk.finki.wp.model.Author;
import mk.finki.wp.model.Book;
import mk.finki.wp.model.Genre;

@Repository
public class BookRepository {
	
	@PersistenceContext
	EntityManager em;
	
	@Transactional
	public Book saveOrUpdateBook(Book entity){
		if (entity.getId() != null && !em.contains(entity)) {
		      entity = em.merge(entity);
		    } else {
		      em.persist(entity);
		    }
		    em.flush();
		    return entity;
		
	}
	public Book createBook(String title,String description,String image){
		Book book = new Book();
		book.setTitle(title);
		book.setDescription(description);
		book.setImage(image);
		return book;
		
	}

	public Book findBookById(Long id){
		TypedQuery<Book> query = em.createQuery("SELECT b FROM Book b WHERE b.id=?1"
								,Book.class);
		query.setParameter(1, id);
		Book result = query.getSingleResult();
		return result;
	}
	
	public List<Book> findAllBooks(){
		TypedQuery<Book> query = em.createQuery("SELECT b FROM Book b",Book.class);
		List <Book> results = query.getResultList();
		return results;
		
	}
	
	public List<Book> findAllBooksByAuthor(Long authorId){
		TypedQuery<Book> query = em.createQuery("SELECT b FROM Book b WHERE b.author.id=?1"
								,Book.class);
		query.setParameter(1, authorId);
		List <Book> results = query.getResultList();
		return results;
	}
	public List<Book> findAllBooksByGenres(List<Genre> genres){
		List<Book> allBooks = findAllBooks();
		List<Book> results = new ArrayList<Book>();
		
		for(Book book : allBooks){
			for(Genre g :genres){
				if(book.getGenres()!=null && book.hasGenre(g.getGenreName())){
					results.add(book);
					break;
				}
					
			}			
		}
		return results;
	}
	
	public String findImageById(Long id) {
		TypedQuery<String> query = em.createQuery("SELECT b.image FROM Book b WHERE b.id=?1",String.class);
		query.setParameter(1, id);
		String result = query.getSingleResult();
		return result;
	}

	
	
	
	
}
