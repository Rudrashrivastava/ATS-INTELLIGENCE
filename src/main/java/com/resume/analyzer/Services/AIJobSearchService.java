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
        String query = (roleQuery == null || roleQuery.trim().isEmpty()) ? "Full Stack Engineer" : roleQuery.trim();
        
        // 1. PRIMARY: Try Mistral AI Generation
        if (mistralApiKey != null && !mistralApiKey.trim().isEmpty()) {
            try {
                return callLLMForJobs(mistralBaseUrl + "/v1/chat/completions", mistralApiKey, mistralModel, query);
            } catch (Exception e) {
                log.warn("Mistral Job Generation failed: {}. Falling back to Groq AI...", e.getMessage());
            }
        }

        // 2. SECONDARY: Try Groq AI Generation
        if (groqApiKey != null && !groqApiKey.trim().isEmpty()) {
            try {
                return callLLMForJobs(groqBaseUrl, groqApiKey, groqModel, query);
            } catch (Exception e) {
                log.warn("Groq Job Generation failed: {}. Falling back to dynamic template...", e.getMessage());
            }
        }

        // 3. FALLBACK: Dynamic Role-Tailored Hiring Directory
        return generateDynamicFallback(query);
    }

    private List<Map<String, Object>> callLLMForJobs(String url, String apiKey, String model, String query) throws Exception {
        String prompt = "Act as an advanced Global Talent & Company Hiring AI Agent.\n" +
                "Generate a list of 15 REAL, AUTHENTIC company hiring opportunities for the role: '" + query + "'.\n" +
                "Include top global tech & enterprise companies such as Google, Microsoft, Amazon Web Services, Meta, Tata Consultancy Services (TCS), Infosys, Accenture, Wipro, IBM, Deloitte, Oracle, Adobe, Netflix, Uber, Salesforce, Apple, Intel, Cisco, NVIDIA, Razorpay.\n" +
                "Return ONLY a raw JSON array of objects with exact keys:\n" +
                "title (specific position title matching " + query + "), " +
                "company_name (real hiring company name), " +
                "location (e.g. Mountain View, CA / Remote / Hybrid / Bangalore / New York), " +
                "salary (realistic salary range e.g. $125,000 - $185,000 or ₹14 - ₹28 LPA), " +
                "description (2-3 sentence role description focused on key candidate skill fit), " +
                "url (official company career portal URL, e.g. https://careers.google.com, https://careers.microsoft.com, https://amazon.jobs, https://tcs.com/careers, https://infosys.com/careers, https://accenture.com/careers, https://wipro.com/careers, etc.).\n" +
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

    private List<Map<String, Object>> generateDynamicFallback(String query) {
        return List.of(
            Map.of("title", "Software Engineer - " + query, "company_name", "Google", "location", "Mountain View, CA / Remote", "salary", "$135,000 - $195,000", "description", "Build scalable cloud services and infrastructure at Google.", "url", "https://careers.google.com/jobs/results/"),
            Map.of("title", "Senior " + query + " Engineer", "company_name", "Microsoft", "location", "Redmond, WA / Hybrid", "salary", "$130,000 - $185,000", "description", "Architect next-generation AI platform features for Azure enterprise tools.", "url", "https://careers.microsoft.com/us/en/search-results"),
            Map.of("title", query + " Specialist (AWS)", "company_name", "Amazon Web Services", "location", "Seattle, WA / Remote", "salary", "$140,000 - $190,000", "description", "Design high-performance distributed microservices for AWS global customers.", "url", "https://amazon.jobs/en/search"),
            Map.of("title", "Full Stack " + query, "company_name", "Meta", "location", "Menlo Park, CA / Remote", "salary", "$145,000 - $205,000", "description", "Develop high-speed front-end and back-end systems connecting billions of users.", "url", "https://www.metacareers.com/jobs"),
            Map.of("title", "System Developer - " + query, "company_name", "Tata Consultancy Services (TCS)", "location", "New York, NY / Hybrid", "salary", "₹14 - ₹28 LPA / $95k - $125k", "description", "Enterprise solution engineering and cloud transformation projects.", "url", "https://www.tcs.com/careers"),
            Map.of("title", "Associate " + query, "company_name", "Infosys", "location", "Bangalore / Remote", "salary", "₹12 - ₹24 LPA / $90k - $120k", "description", "Accelerate digital transformation for Global 2000 clients.", "url", "https://www.infosys.com/careers.html"),
            Map.of("title", query + " Technology Consultant", "company_name", "Accenture", "location", "Chicago, IL / Hybrid", "salary", "$115,000 - $155,000", "description", "Deliver modern engineering, automation, and AI integration for enterprise clients.", "url", "https://www.accenture.com/us-en/careers"),
            Map.of("title", "Cloud Engineer - " + query, "company_name", "Wipro", "location", "Hyderabad / Remote", "salary", "₹10 - ₹22 LPA / $85k - $115k", "description", "Maintain cloud infrastructure and devops automation pipelines.", "url", "https://careers.wipro.com/careers-home/"),
            Map.of("title", "Lead Architect - " + query, "company_name", "IBM", "location", "Austin, TX / Hybrid", "salary", "$130,000 - $175,000", "description", "Architect hybrid cloud and enterprise AI security workflows.", "url", "https://www.ibm.com/careers"),
            Map.of("title", query + " Engineer", "company_name", "Deloitte", "location", "Boston, MA / Remote", "salary", "$110,000 - $150,000", "description", "Drive technology consulting, cybersecurity, and modern backend design.", "url", "https://www.deloitte.com/us/en/careers/job-search.html"),
            Map.of("title", "Database & Application Developer", "company_name", "Oracle", "location", "Austin, TX / Hybrid", "salary", "$125,000 - $170,000", "description", "Optimize high-throughput cloud database platforms and microservices.", "url", "https://www.oracle.com/corporate/careers/"),
            Map.of("title", "Frontend/Backend " + query, "company_name", "Adobe", "location", "San Jose, CA / Remote", "salary", "$135,000 - $180,000", "description", "Build rich creative suite web interfaces and cloud collaboration engines.", "url", "https://adobe.wd5.myworkdayjobs.com/external_experience"),
            Map.of("title", "Backend Infrastructure " + query, "company_name", "Netflix", "location", "Los Gatos, CA / Remote", "salary", "$170,000 - $260,000", "description", "Engineers real-time video streaming microservices and distributed storage.", "url", "https://jobs.netflix.com/search"),
            Map.of("title", query + " Operations Lead", "company_name", "Uber", "location", "San Francisco, CA / Hybrid", "salary", "$140,000 - $195,000", "description", "Build low-latency dispatch and routing platforms for mobility.", "url", "https://www.uber.com/us/en/careers/list/"),
            Map.of("title", "Software Engineer - Salesforce Platform", "company_name", "Salesforce", "location", "San Francisco, CA / Remote", "salary", "$130,000 - $180,000", "description", "Construct multi-tenant enterprise CRM microservices and real-time APIs.", "url", "https://salesforce.wd1.myworkdayjobs.com/External_Career_Site"),
            Map.of("title", "iOS / Core System " + query, "company_name", "Apple", "location", "Cupertino, CA / Hybrid", "salary", "$145,000 - $210,000", "description", "Innovate high-performance operating system components and web tools.", "url", "https://www.apple.com/careers/us/"),
            Map.of("title", "AI & CUDA Software " + query, "company_name", "NVIDIA", "location", "Santa Clara, CA / Remote", "salary", "$160,000 - $240,000", "description", "Accelerate deep learning pipelines, GPU computing, and AI inference engines.", "url", "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite"),
            Map.of("title", "Fintech Backend Engineer", "company_name", "Razorpay", "location", "Bangalore / Remote", "salary", "₹18 - ₹36 LPA", "description", "Scale high-frequency payment gateways and banking APIs.", "url", "https://razorpay.com/jobs/"),
            Map.of("title", "Autopilot & Vision Engineer", "company_name", "Tesla", "location", "Palo Alto, CA / Hybrid", "salary", "$150,000 - $220,000", "description", "Build real-time computer vision and neural networking software.", "url", "https://www.tesla.com/careers"),
            Map.of("title", "Audio Streaming Infrastructure - " + query, "company_name", "Spotify", "location", "Stockholm / Remote", "salary", "€90,000 - €140,000", "description", "Develop real-time music and podcast recommendation engines.", "url", "https://lifeatspotify.com/jobs"),
            Map.of("title", "Distributed Systems Lead", "company_name", "Airbnb", "location", "San Francisco, CA / Remote", "salary", "$155,000 - $225,000", "description", "Scale global marketplace search, trust, and booking services.", "url", "https://careers.airbnb.com/positions/"),
            Map.of("title", "Payments Core " + query, "company_name", "Stripe", "location", "Seattle, WA / Remote", "salary", "$160,000 - $230,000", "description", "Architect low-latency financial API infrastructure for global ecommerce.", "url", "https://stripe.com/jobs"),
            Map.of("title", "Senior " + query + " - Professional Network", "company_name", "LinkedIn", "location", "Sunnyvale, CA / Hybrid", "salary", "$140,000 - $195,000", "description", "Engineers high-concurrency feeds and recruiter matchmaking platforms.", "url", "https://www.linkedin.com/careers/"),
            Map.of("title", "Foundry Platform Architect", "company_name", "Palantir Technologies", "location", "Denver, CO / Hybrid", "salary", "$150,000 - $215,000", "description", "Build enterprise data integration, analytics, and AI command hubs.", "url", "https://www.palantir.com/careers/"),
            Map.of("title", "Cloud Networking Developer", "company_name", "Cisco", "location", "San Jose, CA / Remote", "salary", "$125,000 - $175,000", "description", "Develop secure enterprise network routing software and telemetry.", "url", "https://jobs.cisco.com/"),
            Map.of("title", "Silicon & Compiler Engineer", "company_name", "Intel", "location", "Portland, OR / Hybrid", "salary", "$130,000 - $185,000", "description", "Optimize system software drivers, microcode, and semiconductor tools.", "url", "https://jobs.intel.com/"),
            Map.of("title", "GPU Software Developer", "company_name", "AMD", "location", "Austin, TX / Hybrid", "salary", "$135,000 - $190,000", "description", "Develop open-source ROCm AI software stacks and driver software.", "url", "https://careers.amd.com/"),
            Map.of("title", "Developer Tools " + query, "company_name", "GitHub", "location", "Remote / Global", "salary", "$140,000 - $200,000", "description", "Engineers developer workflows, GitHub Actions, and code analysis tools.", "url", "https://github.com/careers"),
            Map.of("title", "Applied AI Research " + query, "company_name", "OpenAI", "location", "San Francisco, CA / Hybrid", "salary", "$220,000 - $350,000", "description", "Build scalable training systems, API infrastructure, and frontier AI tools.", "url", "https://openai.com/careers/"),
            Map.of("title", "Jira & Cloud Platform Engineer", "company_name", "Atlassian", "location", "Sydney / Remote", "salary", "$135,000 - $190,000", "description", "Develop enterprise collaboration, cloud microservices, and CI/CD tools.", "url", "https://www.atlassian.com/company/careers"),
            Map.of("title", "Starlink Mission Software Engineer", "company_name", "SpaceX", "location", "Hawthorne, CA / Onsite", "salary", "$145,000 - $210,000", "description", "Program real-time flight controls, satellite telemetry, and ground systems.", "url", "https://www.spacex.com/careers/")
        );
    }
}
