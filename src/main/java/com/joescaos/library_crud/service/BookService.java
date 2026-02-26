package com.joescaos.library_crud.service;

import com.joescaos.library_crud.dto.BookDto;
import com.joescaos.library_crud.entity.Author;
import com.joescaos.library_crud.entity.Book;
import com.joescaos.library_crud.mapper.BookMapper;
import com.joescaos.library_crud.repository.AuthorRepository;
import com.joescaos.library_crud.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final BookMapper bookMapper;

    public List<BookDto> findAll() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toDTO)
                .toList();
    }

    public BookDto findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return bookMapper.toDTO(book);
    }

    public BookDto create(BookDto dto) {

        Author author = authorRepository.findById(dto.authorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Book book = bookMapper.toEntity(dto);
        book.setAuthor(author);

        return bookMapper.toDTO(bookRepository.save(book));
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }
}
