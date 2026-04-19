package com.nexuscontact.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactDto {
    private UUID id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String avatarColor;
    private boolean isFavorite;
    private UUID categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}