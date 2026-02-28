package com.joescaos.library_crud.mapper;

import com.joescaos.library_crud.dto.AuthorDto;
import com.joescaos.library_crud.dto.BookDto;
import com.joescaos.library_crud.entity.Author;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthorMapper {

    private final BookMapper bookMapper;

    public AuthorDto toDTO(Author author) {

        List<BookDto> books = author.getBooks() == null
                ? Collections.emptyList()
                : author.getBooks().stream()
                .map(bookMapper::toDTO).collect(Collectors.toList());

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
