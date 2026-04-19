package com.nexuscontact.repository;

import com.nexuscontact.model.Contact;
import com.nexuscontact.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID>, JpaSpecificationExecutor<Contact> {

    @Query("SELECT c FROM Contact c WHERE c.user = :user AND " +
            "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
            "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Contact> findUserContactsWithFilters(
            @Param("user") User user,
            @Param("search") String search,
            @Param("categoryId") UUID categoryId,
            Pageable pageable
    );

    Optional<Contact> findByIdAndUser(UUID id, User user);

    @Query("SELECT c FROM Contact c WHERE c.user = :user")
    List<Contact> findAllByUserForExport(@Param("user") User user);
}