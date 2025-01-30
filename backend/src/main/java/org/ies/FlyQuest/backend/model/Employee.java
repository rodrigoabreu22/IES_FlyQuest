package org.ies.FlyQuest.backend.model;

import java.util.Collections;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Collection;

@Entity(name="employee")
public class Employee implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "First name is mandatory")
    @Column(name="first_name", nullable=false)
    private String first_name;

    @NotBlank(message = "Last name is mandatory")
    @Column(name="last_name", nullable=false)
    private String last_name;

    @NotBlank(message = "Address is mandatory")
    @Column(name="address", nullable=false)
    private String address;

    @NotBlank(message = "Zip is mandatory")
    @Pattern(regexp = "\\d{4}-\\d{3}", message = "ZIP code should be like this example: 1234-123")
    @Column(name="zip", nullable=false)
    private String zip;

    @Pattern(regexp = "\\d{9}", message = "ZIP code should be like this example: 1234-123")
    @Column(name="phone", nullable=false)
    private String phone;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Column(name="email", nullable=false)
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Column(name="password", nullable=false)
    private String password;

    @NotBlank(message = "Gender is mandatory")
    @Column(name="gender", nullable=false)
    private String gender;

    @NotBlank(message = "Role is mandatory")
    @Column(name="role", nullable=false)
    private String role;

    @Min(value = 18, message = "Age should be at least 18")
    @Column(name="age", nullable=false)
    private int age;

    @Column(name="startDate", nullable=false)
    private Date startDate;

    @Column(name="active", nullable=false)
    private Boolean isActive;

    public Employee() {
        this.startDate = new Date(); 
        this.isActive = true;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return first_name;
    }

    public void setFirstName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public Boolean getActive(){
        return this.isActive;
    }

    public void setActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public Date getStartDate(){
        return this.startDate;
    }
}