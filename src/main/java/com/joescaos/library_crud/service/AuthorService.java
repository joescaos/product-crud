package com.joescaos.library_crud.service;

import com.joescaos.library_crud.dto.AuthorDto;
import com.joescaos.library_crud.entity.Author;
import com.joescaos.library_crud.mapper.AuthorMapper;
import com.joescaos.library_crud.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    public List<AuthorDto> findAll() {
        return authorRepository.findAll()
                .stream()
                .map(authorMapper::toDTO)
                .toList();
    }

    public AuthorDto findById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        return authorMapper.toDTO(author);
    }

    public AuthorDto create(Author author) {
        return authorMapper.toDTO(authorRepository.save(author));
    }

    public AuthorDto update(Long id, Author updated) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        author.setName(updated.getName());
        author.setLastName(updated.getLastName());
        author.setGenre(updated.getGenre());
        author.setNationality(updated.getNationality());
        author.setBirthdate(updated.getBirthdate());

        return authorMapper.toDTO(authorRepository.save(author));
    }

    public void delete(Long id) {
        authorRepository.deleteById(id);
    }

    public Author findAuthorByNameAndLastName(AuthorDto authorDto) {
        return authorRepository.findByNameAndLastName(authorDto.name(), authorDto.lastName())
                .orElseGet(() ->
                        authorRepository.save(
                                Author.builder()
                                        .name(authorDto.name())
                                        .lastName(authorDto.lastName())
                                        .genre(authorDto.genre())
                                        .nationality(authorDto.nationality())
                                        .birthdate(authorDto.birthdate())
                                        .build()
                        )
                );
    }
}
