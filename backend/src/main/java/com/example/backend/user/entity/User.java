package com.example.backend.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * @Entity - JPA will know to map the instances of User to rows in a database table
 * @Table(name="users") - Entity corresponds to the table user
 */
@Entity
@Table(name="users")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class User {
    /**
     * @Id - Primary key of the table
     * @GeneratedValue - Auto generates a unique id for each User using a UUID and inserts in the ID column when saving the new entity
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Size(max=200) @NotBlank
    private String name;

    @Email @Size(max=200) @NotBlank
    @Column(length=200, nullable=false, unique=true)
    private String email;

    @Size(min=8, max=60) @NotBlank
    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
