package com.example.nln_project.security.services;

import java.time.LocalDate;
import java.util.Collection; // Import Collection for holding authorities
import java.util.List; // Import List for storing roles
import java.util.Objects; // Import Objects for object comparison
import java.util.stream.Collectors; // Import Collectors for stream operations

import com.example.nln_project.model.Account;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority; // Import GrantedAuthority for user authorities
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import SimpleGrantedAuthority for role representation
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails for Spring Security
import com.fasterxml.jackson.annotation.JsonIgnore; // Import JsonIgnore to prevent serialization of sensitive data

/**
 * Implementation of Spring Security's UserDetails interface for representing account details.
 */
@Data
public class AccountDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L; // Serializable version identifier

	private String id; // Unique identifier for the account
	private String username; // Username of the account
	private String name; // Name of the account
	private LocalDate dateOfBirth; // Date of Birth of the account
	private String email; // Email address of the account
	private String phone; // Phone number of the account

	@JsonIgnore // Prevent serialization of the password field
	private String password; // Password of the account
	private String status; //Status of account

	private Collection<? extends GrantedAuthority> authorities; // Collection of account's authorities (roles)

	/**
	 * Constructor to initialize AccountDetailsImpl.
	 *
	 * @param id           The unique identifier of the account.
	 * @param username     The username of the account.
	 * @param name         The name of the account.
	 * @param dateOfBirth  The date of birth of the account.
	 * @param email        The email of the account.
	 * @param phone        The phone number of the account.
	 * @param password     The password of the account.
	 * @param authorities  The collection of account's authorities.
	 */
	public AccountDetailsImpl(String id, String username, String name, LocalDate dateOfBirth, String email, String phone, String password,String status,
							  Collection<? extends GrantedAuthority> authorities) {
		this.id = id; // Set account ID
		this.username = username; // Set username
		this.name = name; // Set name
		this.dateOfBirth = dateOfBirth; // Set date of birth
		this.email = email; // Set email
		this.phone = phone; // Set phone number
		this.password = password; // Set password
		this.status = status;
		this.authorities = authorities; // Set authorities
	}

	/**
	 * Builds an AccountDetailsImpl instance from an Account object.
	 *
	 * @param account The Account object.
	 * @return An AccountDetailsImpl instance.
	 */
	public static AccountDetailsImpl build(Account account) {
		// Map the roles of the account to GrantedAuthority
		List<GrantedAuthority> authorities = account.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name())) // Convert each role to SimpleGrantedAuthority
				.collect(Collectors.toList()); // Collect into a list

		// Return a new AccountDetailsImpl object
		return new AccountDetailsImpl(
				account.getId(), // Account ID
				account.getUsername(), // Username
				account.getName(), // Name
				account.getDateOfBirth(), // Date of Birth
				account.getEmail(), // Email
				account.getPhone(), // Phone Number
				account.getPassword(),
				account.getStatus(),// Password
				authorities); // Account authorities
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities; // Return account's authorities
	}


	@Override
	public String getPassword() {
		return password; // Return password
	}

	@Override
	public String getUsername() {
		return username; // Return username
	}

	@Override
	public boolean isAccountNonExpired() {
		return true; // Account is not expired
	}

	@Override
	public boolean isAccountNonLocked() {
		return true; // Account is not locked
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true; // Credentials are not expired
	}

	@Override
	public boolean isEnabled() {
		return true; // Account is enabled
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) // Check if the same object
			return true;
		if (o == null || getClass() != o.getClass()) // Check if the object is null or not of the same class
			return false;
		AccountDetailsImpl account = (AccountDetailsImpl) o; // Cast to AccountDetailsImpl
		return Objects.equals(id, account.id); // Check if IDs are equal
	}
}
