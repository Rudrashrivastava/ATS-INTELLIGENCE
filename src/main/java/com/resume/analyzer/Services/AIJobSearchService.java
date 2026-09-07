package com.resume.analyzer.Services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIJobSearchService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.openai.api-key:${MISTRAL_API_KEY:}}")
    private String mistralApiKey;

    @Value("${spring.ai.openai.base-url:https://api.mistral.ai}")
    private String mistralBaseUrl;

    @Value("${spring.ai.openai.chat.options.model:mistral-small-latest}")
    private String mistralModel;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.base-url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqBaseUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    public List<Map<String, Object>> generateCompanyJobs(String roleQuery) {
        return generateCompanyJobs(roleQuery, "India");
    }

    public List<Map<String, Object>> generateCompanyJobs(String roleQuery, String locationQuery) {
        String query = (roleQuery == null || roleQuery.trim().isEmpty()) ? "Full Stack Engineer" : roleQuery.trim();
        String loc = (locationQuery == null || locationQuery.trim().isEmpty()) ? "India" : locationQuery.trim();
        
        // 1. PRIMARY: Try Mistral AI Generation
        if (mistralApiKey != null && !mistralApiKey.trim().isEmpty()) {
            try {
                return callLLMForJobs(mistralBaseUrl + "/v1/chat/completions", mistralApiKey, mistralModel, query, loc);
            } catch (Exception e) {
                log.warn("Mistral Job Generation failed: {}. Falling back to Groq AI...", e.getMessage());
            }
        }

        // 2. SECONDARY: Try Groq AI Generation
        if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
            try {
                return callLLMForJobs(groqBaseUrl, groqApiKey, groqModel, query, loc);
            } catch (Exception e) {
                log.warn("Groq Job Generation failed: {}. Falling back to dynamic template...", e.getMessage());
            }
        }

        // 3. FALLBACK: Dynamic Role & Location Tailored Hiring Directory
        return generateDynamicFallback(query, loc);
    }

    private List<Map<String, Object>> callLLMForJobs(String url, String apiKey, String model, String query, String location) throws Exception {
        String prompt = "Act as an advanced Global Talent & Company Hiring AI Agent.\n" +
                "Generate a list of 20 REAL, AUTHENTIC company hiring opportunities for the role: '" + query + "' in location: '" + location + "'.\n" +
                "Include top global & Indian tech/enterprise companies such as Google, Microsoft, Amazon, Meta, Tata Consultancy Services (TCS), Infosys, Accenture, Wipro, IBM, Deloitte, Oracle, Adobe, Netflix, Uber, Salesforce, Apple, Intel, Cisco, NVIDIA, Razorpay, Flipkart, Zomato, Swiggy, Paytm.\n" +
                "Return ONLY a raw JSON array of objects with exact keys:\n" +
                "title (specific position title matching " + query + "), " +
                "company_name (real hiring company name), " +
                "location (e.g. Bangalore / Hyderabad / Pune / Gurgaon / Remote India / Mountain View, CA), " +
                "work_mode (Remote / Hybrid / Onsite), " +
                "country (India / United States / Global), " +
                "salary (realistic salary e.g. ₹14 - ₹28 LPA or $125,000 - $185,000), " +
                "description (2-3 sentence role description focused on key candidate skill fit), " +
                "url (official company career portal search URL for " + query + "), " +
                "platform_url (LinkedIn or Naukri direct job search URL for " + query + ").\n" +
                "CRITICAL: NO MARKDOWN. NO CONVERSATION. ONLY A VALID RAW JSON ARRAY.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("temperature", 0.2);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").get(0).path("message").path("content").asText();

        int start = content.indexOf("[");
        int end = content.lastIndexOf("]");
        if (start != -1 && end != -1) {
            content = content.substring(start, end + 1);
        }

        return objectMapper.readValue(content, new TypeReference<List<Map<String, Object>>>() {});
    }

    private List<Map<String, Object>> generateDynamicFallback(String query, String location) {
        boolean isIndia = location.equalsIgnoreCase("India") || location.toLowerCase().contains("india");
        
        String loc1 = isIndia ? "Bangalore, India / Hybrid" : "Mountain View, CA / Remote";
        String loc2 = isIndia ? "Hyderabad, India / Remote" : "Redmond, WA / Hybrid";
        String loc3 = isIndia ? "Gurgaon / Delhi NCR / Remote" : "Seattle, WA / Remote";
        String loc4 = isIndia ? "Mumbai / Pune / Hybrid" : "Menlo Park, CA / Remote";
        
        String sal1 = isIndia ? "₹18 - ₹35 LPA" : "$135,000 - $195,000";
        String sal2 = isIndia ? "₹16 - ₹32 LPA" : "$130,000 - $185,000";
        String sal3 = isIndia ? "₹12 - ₹24 LPA" : "₹14 - ₹28 LPA / $95k";

        return List.of(
            Map.of("title", "Software Engineer - " + query, "company_name", "Google", "location", loc1, "work_mode", "Hybrid", "country", isIndia ? "India" : "United States", "salary", sal1, "description", "Build scalable cloud services, web infrastructure, and AI systems at Google.", "url", "https://careers.google.com/jobs/results/?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Google%20" + query + "&location=" + location),
            Map.of("title", "Senior " + query + " Engineer", "company_name", "Microsoft", "location", loc2, "work_mode", "Remote", "country", isIndia ? "India" : "United States", "salary", sal1, "description", "Architect next-generation AI platform features for Azure enterprise tools.", "url", "https://careers.microsoft.com/us/en/search-results?keywords=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Microsoft%20" + query + "&location=" + location),
            Map.of("title", query + " Specialist (AWS)", "company_name", "Amazon Web Services", "location", loc3, "work_mode", "Remote", "country", isIndia ? "India" : "United States", "salary", sal2, "description", "Design high-performance distributed microservices for AWS global customers.", "url", "https://amazon.jobs/en/search?base_query=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Amazon%20" + query + "&location=" + location),
            Map.of("title", "Full Stack " + query, "company_name", "Meta", "location", loc4, "work_mode", "Hybrid", "country", isIndia ? "India" : "United States", "salary", sal1, "description", "Develop high-speed front-end and back-end systems connecting billions of users.", "url", "https://www.metacareers.com/jobs/?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Meta%20" + query + "&location=" + location),
            Map.of("title", "System Developer - " + query, "company_name", "Tata Consultancy Services (TCS)", "location", "Mumbai / Pune / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹12 - ₹22 LPA", "description", "Enterprise solution engineering and cloud transformation projects.", "url", "https://www.tcs.com/careers", "platform_url", "https://www.naukri.com/tcs-" + query.toLowerCase().replace(" ", "-") + "-jobs"),
            Map.of("title", "Associate " + query, "company_name", "Infosys", "location", "Bangalore / Remote", "work_mode", "Remote", "country", "India", "salary", "₹10 - ₹20 LPA", "description", "Accelerate digital transformation for Global 2000 clients.", "url", "https://www.infosys.com/careers.html", "platform_url", "https://www.naukri.com/infosys-" + query.toLowerCase().replace(" ", "-") + "-jobs"),
            Map.of("title", query + " Technology Consultant", "company_name", "Accenture", "location", "Gurgaon / Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹14 - ₹26 LPA", "description", "Deliver modern engineering, automation, and AI integration for enterprise clients.", "url", "https://www.accenture.com/in-en/careers/jobsearch?keyword=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Accenture%20" + query + "&location=India"),
            Map.of("title", "Cloud Engineer - " + query, "company_name", "Wipro", "location", "Hyderabad / Remote", "work_mode", "Remote", "country", "India", "salary", "₹10 - ₹18 LPA", "description", "Maintain cloud infrastructure and devops automation pipelines.", "url", "https://careers.wipro.com/careers-home/", "platform_url", "https://www.naukri.com/wipro-" + query.toLowerCase().replace(" ", "-") + "-jobs"),
            Map.of("title", "Lead Architect - " + query, "company_name", "IBM", "location", "Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹20 - ₹38 LPA", "description", "Architect hybrid cloud and enterprise AI security workflows.", "url", "https://www.ibm.com/careers/search?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=IBM%20" + query + "&location=India"),
            Map.of("title", query + " Engineer", "company_name", "Deloitte", "location", "Hyderabad / Remote", "work_mode", "Remote", "country", "India", "salary", "₹15 - ₹28 LPA", "description", "Drive technology consulting, cybersecurity, and modern backend design.", "url", "https://www.deloitte.com/in/en/careers/job-search.html", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Deloitte%20" + query + "&location=India"),
            Map.of("title", "Database & Application Developer", "company_name", "Oracle", "location", "Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹18 - ₹32 LPA", "description", "Optimize high-throughput cloud database platforms and microservices.", "url", "https://www.oracle.com/corporate/careers/", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Oracle%20" + query + "&location=India"),
            Map.of("title", "Frontend/Backend " + query, "company_name", "Adobe", "location", "Noida / Bangalore / Remote", "work_mode", "Remote", "country", "India", "salary", "₹22 - ₹42 LPA", "description", "Build rich creative suite web interfaces and cloud collaboration engines.", "url", "https://adobe.wd5.myworkdayjobs.com/external_experience?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Adobe%20" + query + "&location=India"),
            Map.of("title", "Fintech Backend Engineer", "company_name", "Razorpay", "location", "Bangalore / Remote", "work_mode", "Remote", "country", "India", "salary", "₹20 - ₹40 LPA", "description", "Scale high-frequency payment gateways and banking APIs.", "url", "https://razorpay.com/jobs/", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Razorpay%20" + query + "&location=India"),
            Map.of("title", "Senior " + query + " - E-commerce", "company_name", "Flipkart", "location", "Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹22 - ₹45 LPA", "description", "Scale India's largest ecommerce fulfillment algorithms and checkout microservices.", "url", "https://www.flipkartcareers.com/", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Flipkart%20" + query + "&location=India"),
            Map.of("title", "Consumer Tech Lead - " + query, "company_name", "Zomato", "location", "Gurgaon / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹24 - ₹48 LPA", "description", "Engineer hyper-local delivery algorithms and real-time logistics networks.", "url", "https://www.zomato.com/careers", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Zomato%20" + query + "&location=India"),
            Map.of("title", "iOS / Core System " + query, "company_name", "Apple", "location", "Hyderabad / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹24 - ₹45 LPA", "description", "Innovate high-performance operating system components and web tools.", "url", "https://www.apple.com/careers/us/", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Apple%20" + query + "&location=India"),
            Map.of("title", "AI & CUDA Software " + query, "company_name", "NVIDIA", "location", "Pune / Bangalore / Remote", "work_mode", "Remote", "country", "India", "salary", "₹25 - ₹50 LPA", "description", "Accelerate deep learning pipelines, GPU computing, and AI inference engines.", "url", "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=NVIDIA%20" + query + "&location=India"),
            Map.of("title", query + " Operations Lead", "company_name", "Uber", "location", "Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹22 - ₹42 LPA", "description", "Build low-latency dispatch and routing platforms for mobility.", "url", "https://www.uber.com/us/en/careers/list/?query=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Uber%20" + query + "&location=India"),
            Map.of("title", "Backend Infrastructure " + query, "company_name", "Netflix", "location", "Los Gatos, CA / Remote", "work_mode", "Remote", "country", "Global", "salary", "$170,000 - $260,000", "description", "Engineers real-time video streaming microservices and distributed storage.", "url", "https://jobs.netflix.com/search?q=" + query, "platform_url", "https://www.linkedin.com/jobs/search/?keywords=Netflix%20" + query),
            Map.of("title", "Senior " + query + " - Professional Network", "company_name", "LinkedIn", "location", "Bangalore / Hybrid", "work_mode", "Hybrid", "country", "India", "salary", "₹25 - ₹45 LPA", "description", "Engineers high-concurrency feeds and recruiter matchmaking platforms.", "url", "https://www.linkedin.com/careers/", "platform_url", "https://www.linkedin.com/jobs/search/?keywords=LinkedIn%20" + query + "&location=India")
        );
    }
}
