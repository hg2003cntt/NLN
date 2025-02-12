package com.example.nln_project.validation.annotation;

import com.example.nln_project.validation.validator.AdultValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AdultValidator.class)
public @interface Adult {
    String message() default "Người dùng phải từ 18 tuổi trở lên.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
