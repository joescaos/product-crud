package com.joescaos.library_crud.mapper;

import com.joescaos.library_crud.dto.AuthorDto;
import com.joescaos.library_crud.dto.BookDto;
import com.joescaos.library_crud.entity.Author;
import com.joescaos.library_crud.entity.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthorMapper {

    private final BookMapper bookMapper;

    public AuthorDto toDTO(Author author) {

        List<BookDto> books = author.getBooks()
                .stream()
                .map(bookMapper::toDTO)
                .toList();

        return new AuthorDto(
                author.getId(),
                author.getName(),
                author.getLastName(),
                author.getGenre(),
                author.getNationality(),
                author.getBirthdate(),
                books
        );
    }
}
