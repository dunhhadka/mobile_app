//package org.example.management.management.domain.expenses;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Size;
//import lombok.Getter;
//
//import java.math.BigDecimal;
//import java.time.Instant;
//
//@Getter
//@Entity
//@Table(name = "expenses")
//public class Expense {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//
//    @Enumerated(value = EnumType.STRING)
//    private Category category;
//
//    private Instant transactionDate;
//
//    @NotNull
//    private BigDecimal amount;
//
//    @Size(max = 500)
//    private String description;
//
//    private String document; //file || url
//
//    private Integer createdById;
//
//    private Integer reviewerId;
//
//    public enum Status {
//        review,
//        approved
//    }
//
//    public enum Category {
//        business_trip,
//        office //TODO: Thêm
//    }
//}
