package com.joescaos.library_crud.mapper;

import com.joescaos.library_crud.dto.BookDto;
import com.joescaos.library_crud.entity.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public BookDto toDTO(Book book) {
        if (book == null) return null;

        return new BookDto(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getGenre(),
                book.getIsAvailable(),
                book.getAmountSold(),
                book.getPublicationDate(),
                book.getAuthor() != null ? book.getAuthor().getId() : null
        );
    }

    public Book toEntity(BookDto dto) {
        if (dto == null) return null;

        return Book.builder()
                .id(dto.id())
                .title(dto.title())
                .description(dto.description())
                .genre(dto.genre())
                .isAvailable(dto.isAvailable())
                .amountSold(dto.amountSold())
                .publicationDate(dto.publicationDate())
                .build();
    }
}
