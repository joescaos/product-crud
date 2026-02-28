package com.joescaos.library_crud.dto;

import java.time.Instant;
import java.util.List;

public record AuthorDto(
        Long id,
        String name,
        String lastName,
        String genre,
        String nationality,
        Instant birthdate,
        List<BookDto> books
) {
}
