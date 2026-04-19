package com.nexuscontact.service;

import com.nexuscontact.dto.ContactDto;
import com.nexuscontact.exception.ResourceNotFoundException;
import com.nexuscontact.model.Category;
import com.nexuscontact.model.Contact;
import com.nexuscontact.model.User;
import com.nexuscontact.repository.CategoryRepository;
import com.nexuscontact.repository.ContactRepository;
import com.nexuscontact.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ContactDto> getUserContacts(UUID userId, String search, UUID categoryId, Pageable pageable) {
        User user = userRepository.getReferenceById(userId);
        return contactRepository.findUserContactsWithFilters(user, search, categoryId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public List<ContactDto> getAllContactsForExport(UUID userId) {
        User user = userRepository.getReferenceById(userId);
        return contactRepository.findAllByUserForExport(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactDto createContact(UUID userId, ContactDto dto) {
        User user = userRepository.getReferenceById(userId);
        Contact contact = new Contact();
        mapDtoToEntity(dto, contact, user);
        Contact saved = contactRepository.save(contact);
        return mapToDto(saved);
    }

    @Transactional
    public ContactDto updateContact(UUID userId, UUID contactId, ContactDto dto) {
        User user = userRepository.getReferenceById(userId);
        Contact contact = contactRepository.findByIdAndUser(contactId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        mapDtoToEntity(dto, contact, user);
        Contact saved = contactRepository.save(contact);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteContact(UUID userId, UUID contactId) {
        User user = userRepository.getReferenceById(userId);
        Contact contact = contactRepository.findByIdAndUser(contactId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        contactRepository.delete(contact);
    }

    @Transactional(readOnly = true)
    public ContactDto getContact(UUID userId, UUID contactId) {
        User user = userRepository.getReferenceById(userId);
        Contact contact = contactRepository.findByIdAndUser(contactId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        return mapToDto(contact);
    }

    private ContactDto mapToDto(Contact contact) {
        return ContactDto.builder()
                .id(contact.getId())
                .name(contact.getName())
                .phone(contact.getPhone())
                .email(contact.getEmail())
                .address(contact.getAddress())
                .avatarColor(contact.getAvatarColor())
                .isFavorite(contact.isFavorite())
                .categoryId(contact.getCategory() != null ? contact.getCategory().getId() : null)
                .categoryName(contact.getCategory() != null ? contact.getCategory().getName() : null)
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }

    private void mapDtoToEntity(ContactDto dto, Contact contact, User user) {
        contact.setUser(user);
        contact.setName(dto.getName());
        contact.setPhone(dto.getPhone());
        contact.setEmail(dto.getEmail());
        contact.setAddress(dto.getAddress());
        contact.setAvatarColor(dto.getAvatarColor() != null ? dto.getAvatarColor() : "bg-blue-500");
        contact.setFavorite(dto.isFavorite());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(dto.getCategoryId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            contact.setCategory(category);
        } else {
            contact.setCategory(null);
        }
    }
}