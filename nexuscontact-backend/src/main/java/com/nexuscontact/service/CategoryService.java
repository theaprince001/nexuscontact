package com.nexuscontact.service;

import com.nexuscontact.dto.CategoryDto;
import com.nexuscontact.exception.ResourceNotFoundException;
import com.nexuscontact.model.Category;
import com.nexuscontact.model.User;
import com.nexuscontact.repository.CategoryRepository;
import com.nexuscontact.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getUserCategories(UUID userId) {
        User user = userRepository.getReferenceById(userId);
        return categoryRepository.findByUserOrderByNameAsc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(UUID userId, String name) {
        User user = userRepository.getReferenceById(userId);
        if (categoryRepository.existsByNameAndUser(name, user)) {
            throw new RuntimeException("Category already exists");
        }
        Category category = new Category();
        category.setName(name);
        category.setUser(user);
        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteCategory(UUID userId, UUID categoryId) {
        User user = userRepository.getReferenceById(userId);
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryDto mapToDto(Category category) {
        return new CategoryDto(category.getId(), category.getName());
    }
}