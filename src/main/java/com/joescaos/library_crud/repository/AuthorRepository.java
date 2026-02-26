package com.joescaos.library_crud.repository;

import com.joescaos.library_crud.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findByNameAndLastName(String name, String lastName);
}
