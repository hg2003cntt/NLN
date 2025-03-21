package com.example.nln_project.security.services;

import com.example.nln_project.model.Account;
import com.example.nln_project.repository.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of UserDetailsService to load user-specific data.
 */
@Service
public class AccountDetailsServiceImpl implements UserDetailsService {

    @Autowired
    AccountRepo accountRepo;

    /**
     * Loads user details by username, email, or phone.
     *
     * @param identifier Username, Email, or Phone of the user.
     * @return UserDetails containing user information.
     * @throws UsernameNotFoundException if the user is not found.
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Account account = accountRepo.findByUsername(identifier)
                .or(() -> accountRepo.findByEmail(identifier))
                .or(() -> accountRepo.findByPhone(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with identifier: " + identifier));

        return AccountDetailsImpl.build(account);
    }
}
