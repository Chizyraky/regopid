package com.chizy.regopid.models;
import javax.persistence.*;

@Entity
public class Lecturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String names;

    @Column
    private String email;

    @Column
    private String curriculum;
}
