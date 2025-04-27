package org.example.management.management.application.service.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.management.management.infastructure.exception.ConstrainViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {
    @Value("${spring.mail.username}")
    private String username;

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    @EventListener(MailEvent.class)
    public void sendEmailByKafka(MailEvent event) throws MessagingException, UnsupportedEncodingException {

        if(event.getRecipient() == null || event.getTemplateCode() == null) {
            log.error("Invalid MailEvent: recipient or templateCode is null");
            throw new ConstrainViolationException("Mail", "Nguời nhận null hoặc template null");
        }
        // Chuẩn bị context cho template;
        Context context = new Context();
        context.setVariable("recipientName", event.getRecipient());
        if(event.getParams() != null) {
            context.setVariables(event.getParams());
        }else{
            log.info("Event param is null, cannot set variables in email template.");
        }

        String htmlContext = templateEngine.process(event.getTemplateCode(), context);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        helper.setFrom(username, "MANAGEMENT");
        helper.setTo(event.getRecipient());
        helper.setSubject(event.getSubject());
        helper.setText(htmlContext, true);
        //Xử lí code;
        try{
            mailSender.send(mimeMessage);
            log.info("Email send to {} successfully!", event.getRecipient());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", event.getRecipient(), e.getMessage(), e);
        }

    }
}
