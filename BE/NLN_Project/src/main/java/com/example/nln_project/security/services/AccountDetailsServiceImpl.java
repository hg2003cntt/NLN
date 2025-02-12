package com.example.nln_project.security.services;

import com.example.nln_project.model.Account;
import com.example.nln_project.repository.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired; // Import for dependency injection
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails interface
import org.springframework.security.core.userdetails.UserDetailsService; // Import UserDetailsService interface
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Import for handling user not found
import org.springframework.stereotype.Service; // Import for service annotation
import org.springframework.transaction.annotation.Transactional; // Import for transaction management

/**
 * Implementation of UserDetailsService to load user-specific data.
 */
@Service // Indicates that this class is a service component
public class AccountDetailsServiceImpl implements UserDetailsService {

	@Autowired // Automatically injects UserRepository bean
	AccountRepo userRepository;

	/**
	 * Loads user details by username.
	 *
	 * @param username The username of the user.
	 * @return UserDetails containing user information.
	 * @throws UsernameNotFoundException if the user is not found.
	 */
	@Override
	@Transactional // Ensures that the method is transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// Attempt to find the user by username
		Account user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

		// Return UserDetails implementation for the found user
		return AccountDetailsImpl.build(user);
	}
}
