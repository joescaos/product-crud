package com.joescaos.library_crud.service;

import com.joescaos.library_crud.dto.AuthorDto;
import com.joescaos.library_crud.entity.Author;
import com.joescaos.library_crud.entity.Book;
import com.joescaos.library_crud.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;


@Service
@RequiredArgsConstructor
public class ImportService {

    private final AuthorService authorService;
    private final BookRepository bookRepository;

    @Transactional
    public void importCsv(MultipartFile file) throws IOException {

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(reader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withTrim())) {

            for (CSVRecord record : csvParser) {
                AuthorDto authorDto = new AuthorDto(
                        null,
                        record.get("author_name"),
                        record.get("author_last_name"),
                        record.get("genre"),
                        record.get("nationality"),
                        Instant.parse(record.get("birthdate")),
                        null
                );

                Author author = authorService.findAuthorByNameAndLastName(authorDto);

                Book book = Book.builder()
                        .title(record.get("title"))
                        .description(record.get("description"))
                        .genre(record.get("book_genre"))
                        .isAvailable(Boolean.parseBoolean(record.get("is_available")))
                        .amountSold(Integer.parseInt(record.get("amount_sold")))
                        .publicationDate(Instant.parse(record.get("publication_date")))
                        .author(author)
                        .build();

                bookRepository.save(book);
            }

        }
    }
}