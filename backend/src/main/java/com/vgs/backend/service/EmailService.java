package com.vgs.backend.service;

import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendCode(String toEmail, String code) {
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        String subject = "Your Verification Code";
        Content content = new Content("text/plain", "Your code is: " + code);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
            System.out.println("📧 Code sent to " + toEmail);
        } catch (IOException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
