package com.AiTools.PatientClinic.controller;

import com.AiTools.PatientClinic.models.Patient;
import com.AiTools.PatientClinic.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PatientController.class)
class PatientControllerTest {
    // ... rest unchanged
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PatientRepository patientRepository;

    @Test
    void createPatientReturnsCreatedStatusWithSavedPatientBody() throws Exception {
        Patient saved = new Patient("John", "Doe", 30);
        saved.setId(1L);

        when(patientRepository.save(any(Patient.class))).thenReturn(saved);

        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"age\":30}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.age").value(30));
    }

    @Test
    void createPatientReturnsBadRequestWhenBodyIsInvalidJson() throws Exception {
        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllPatientsReturnsOkWithAllPatients() throws Exception {
        Patient first = new Patient("John", "Doe", 30);
        first.setId(1L);
        Patient second = new Patient("Jane", "Smith", 25);
        second.setId(2L);

        when(patientRepository.findAll()).thenReturn(List.of(first, second));

        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"));
    }

    @Test
    void getAllPatientsReturnsEmptyArrayWhenNoPatientsExist() throws Exception {
        when(patientRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getPatientByIdReturnsPatientWhenFound() throws Exception {
        Patient patient = new Patient("John", "Doe", 30);
        patient.setId(1L);

        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));

        mockMvc.perform(get("/api/patients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.age").value(30));
    }

    @Test
    void getPatientByIdReturnsNotFoundWhenPatientDoesNotExist() throws Exception {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/patients/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updatePatientReturnsUpdatedPatientWhenFound() throws Exception {
        Patient existing = new Patient("John", "Doe", 30);
        existing.setId(1L);

        when(patientRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(patientRepository.save(any(Patient.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(put("/api/patients/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"Updated\",\"lastName\":\"Name\",\"age\":40}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.lastName").value("Name"))
                .andExpect(jsonPath("$.age").value(40));
    }

    @Test
    void updatePatientReturnsNotFoundWhenPatientDoesNotExist() throws Exception {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/patients/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"X\",\"lastName\":\"Y\",\"age\":20}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletePatientReturnsNoContentWhenPatientExists() throws Exception {
        Patient existing = new Patient("John", "Doe", 30);
        existing.setId(1L);

        when(patientRepository.findById(1L)).thenReturn(Optional.of(existing));

        mockMvc.perform(delete("/api/patients/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletePatientReturnsNotFoundWhenPatientDoesNotExist() throws Exception {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/patients/99"))
                .andExpect(status().isNotFound());
    }
}

