package com.chizy.regopid.models;
import javax.persistence.*;
import java.sql.Date;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String studentNo;

    @Column
    private String names;

    @Column
    private Date DoB;

    @Column
    private String email;

    @Column
    private String curriculum;
}
