package com.example.backend.user.model;


/**
 *
 * Patient - View appointments, prescriptions etc.
 * Doctor - Access to the patients under their care
 * Clinic Admin - View / Edit clinic level data (appointments, staff)
 * System Admin - Full access to everything
 */
public enum Role {
    PATIENT,
    DOCTOR,
    CLINIC_ADMIN,
    SYSTEM_ADMIN
}
