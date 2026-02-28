package com.joescaos.library_crud.dto;

import java.time.Instant;

public record BookDto(
        Long id,
        String title,
        String description,
        String genre,
        Boolean isAvailable,
        Integer amountSold,
        Instant publicationDate,
        Long authorId
) {}
