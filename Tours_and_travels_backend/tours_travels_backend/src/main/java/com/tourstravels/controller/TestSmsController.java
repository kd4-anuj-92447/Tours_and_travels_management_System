package com.tourstravels.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tourstravels.service.SmsService;

@RestController
public class TestSmsController {

    private final SmsService smsService;

    public TestSmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @GetMapping("/test-sms")
    public String sendTestSms(@RequestParam String phone) {
        smsService.sendSms(
                phone,
                "Hello! Twilio SMS integration is working successfully 🚀"
        );
        return "SMS sent successfully";
    }
}
