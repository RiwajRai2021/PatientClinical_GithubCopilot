package com.AiTools.PatientClinic.controller;

import java.util.List;

import com.AiTools.PatientClinic.models.ClinicalData;
import com.AiTools.PatientClinic.repository.ClinicalDataRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.AiTools.PatientClinic.exception.PatientNotFoundException;
import com.AiTools.PatientClinic.models.Patient;
import com.AiTools.PatientClinic.repository.PatientRepository;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {


    private final PatientRepository patientRepository;
    private final ClinicalDataRepository clinicalDataRepository;

    public PatientController(PatientRepository patientRepository, ClinicalDataRepository clinicalDataRepository) {
        this.patientRepository = patientRepository;
        this.clinicalDataRepository = clinicalDataRepository;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient savedPatient = patientRepository.save(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
        existing.setFirstName(patient.getFirstName());
        existing.setLastName(patient.getLastName());
        existing.setAge(patient.getAge());
        return ResponseEntity.ok(patientRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
        patientRepository.delete(existing);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{patientId}/clinicals")
    public ResponseEntity<ClinicalData> addClinicalForPatient(
            @PathVariable Long patientId,
            @RequestBody ClinicalData clinicalData) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(patientId));

        clinicalData.setPatient(patient);
        ClinicalData saved = clinicalDataRepository.save(clinicalData);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}

