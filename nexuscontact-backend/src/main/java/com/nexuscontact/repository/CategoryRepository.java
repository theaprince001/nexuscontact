package com.nexuscontact.repository;

import com.nexuscontact.model.Category;
import com.nexuscontact.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserOrderByNameAsc(User user);
    Optional<Category> findByIdAndUser(UUID id, User user);
    boolean existsByNameAndUser(String name, User user);
}