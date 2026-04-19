package com.nexuscontact.service;

import com.nexuscontact.dto.ContactDto;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ExportService {

    public byte[] exportContactsToCsv(List<ContactDto> contacts) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
             CSVWriter writer = new CSVWriter(osw)) {

            writer.writeNext(new String[]{"Name", "Phone", "Email", "Category", "Address"});
            for (ContactDto c : contacts) {
                writer.writeNext(new String[]{
                        c.getName() != null ? c.getName() : "",
                        c.getPhone() != null ? c.getPhone() : "",
                        c.getEmail() != null ? c.getEmail() : "",
                        c.getCategoryName() != null ? c.getCategoryName() : "",
                        c.getAddress() != null ? c.getAddress() : ""
                });
            }
        }
        return baos.toByteArray();
    }
}