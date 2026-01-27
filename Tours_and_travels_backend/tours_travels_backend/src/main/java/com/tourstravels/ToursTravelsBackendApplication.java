package com.tourstravels;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.tourstravels"})
public class ToursTravelsBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ToursTravelsBackendApplication.class, args);
        System.out.println("✅ Tours and Travels Backend started successfully!");
    }
}
