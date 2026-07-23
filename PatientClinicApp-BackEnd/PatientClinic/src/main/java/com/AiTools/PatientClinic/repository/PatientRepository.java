package com.AiTools.PatientClinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AiTools.PatientClinic.models.Patient;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {


}

