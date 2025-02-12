package com.example.nln_project.validation.validator;

import com.example.nln_project.validation.annotation.Adult;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.Period;

public class AdultValidator implements ConstraintValidator<Adult, LocalDate> {

    @Override
    public boolean isValid(LocalDate dateOfBirth, ConstraintValidatorContext context) {
        if (dateOfBirth == null) {
            return false; // Không chấp nhận giá trị null
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears() >= 18;
    }
}
