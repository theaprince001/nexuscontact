package com.nexuscontact.controller;

import com.nexuscontact.dto.CategoryDto;
import com.nexuscontact.security.UserDetailsImpl;
import com.nexuscontact.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(categoryService.getUserCategories(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam String name) {
        return ResponseEntity.ok(categoryService.createCategory(userDetails.getId(), name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        categoryService.deleteCategory(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }
}