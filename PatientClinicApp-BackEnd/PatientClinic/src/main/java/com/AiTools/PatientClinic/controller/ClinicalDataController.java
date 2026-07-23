 package com.AiTools.PatientClinic.controller;

import java.util.List;

import com.AiTools.PatientClinic.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.AiTools.PatientClinic.models.ClinicalData;
import com.AiTools.PatientClinic.repository.ClinicalDataRepository;

@RestController
@RequestMapping("/api/clinical-data")
@CrossOrigin(origins = "*")
public class ClinicalDataController {

    @Autowired
    private PatientRepository patientRepository;

    private final ClinicalDataRepository clinicalDataRepository;

    public ClinicalDataController(ClinicalDataRepository clinicalDataRepository) {
        this.clinicalDataRepository = clinicalDataRepository;
    }

    @PostMapping
    public ResponseEntity<ClinicalData> createClinicalData(@RequestBody ClinicalData clinicalData) {
        ClinicalData savedClinicalData = clinicalDataRepository.save(clinicalData);
        return new ResponseEntity<>(savedClinicalData, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClinicalData>> getAllClinicalData() {
        return ResponseEntity.ok(clinicalDataRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicalData> getClinicalDataById(@PathVariable Long id) {
        return clinicalDataRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClinicalData> updateClinicalData(@PathVariable Long id, @RequestBody ClinicalData clinicalData) {
        return clinicalDataRepository.findById(id)
                .map(existingClinicalData -> {
                    existingClinicalData.setComponentName(clinicalData.getComponentName());
                    existingClinicalData.setComponentValue(clinicalData.getComponentValue());
                    existingClinicalData.setMeasuredDateTime(clinicalData.getMeasuredDateTime());

                    ClinicalData updatedClinicalData = clinicalDataRepository.save(existingClinicalData);
                    return ResponseEntity.ok(updatedClinicalData);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClinicalData(@PathVariable Long id) {
        return clinicalDataRepository.findById(id)
                .map(existingClinicalData -> {
                    clinicalDataRepository.delete(existingClinicalData);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //method that receives patient id, clinical data and saves it to the database
    @PostMapping("/clinical")
    public ResponseEntity<ClinicalData> saveClinicalData(@RequestBody ClinicalData clinicalData) {
        ClinicalData savedClinicalData = clinicalDataRepository.save(clinicalData);
        return new ResponseEntity<>(savedClinicalData, HttpStatus.CREATED);
    }
}

