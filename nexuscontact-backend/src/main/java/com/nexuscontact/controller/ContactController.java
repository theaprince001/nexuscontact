package com.nexuscontact.controller;

import com.nexuscontact.dto.ContactDto;
import com.nexuscontact.security.UserDetailsImpl;
import com.nexuscontact.service.ContactService;
import com.nexuscontact.service.ExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final ExportService exportService;

    @GetMapping
    public ResponseEntity<Page<ContactDto>> getContacts(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(contactService.getUserContacts(userDetails.getId(), search, categoryId, pageable));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportContacts(@AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        List<ContactDto> contacts = contactService.getAllContactsForExport(userDetails.getId());
        byte[] csvData = exportService.exportContactsToCsv(contacts);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contacts.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ContactDto contactDto) {
        return ResponseEntity.ok(contactService.createContact(userDetails.getId(), contactDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody ContactDto contactDto) {
        return ResponseEntity.ok(contactService.updateContact(userDetails.getId(), id, contactDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        contactService.deleteContact(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContact(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id) {
        return ResponseEntity.ok(contactService.getContact(userDetails.getId(), id));
    }
}