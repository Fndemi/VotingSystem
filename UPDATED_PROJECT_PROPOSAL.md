DEDAN KIMATHI UNIVERSITY OF TECHNOLOGY
 
SCHOOL OF COMPUTER SCIENCE AND INFORMATION TECHNOLOGY

NAME: NDEMI FLORENCE WANJIRU
 
REGISTRATION NUMBER: C025-01-0831/2022
 
SUPERVISOR: MR SAMUEL MUCHINA
 
PROJECT TITLE:
 
BlockVote - Web-Based Student Council Election System
 
A Project proposal submitted to the Department of Information Technology in the School of Computer Science and Information Technology in partial fulfillment of the requirements for the award of the degree of BSc. in Information Technology at Dedan Kimathi University of Technology 
JULY 2025

## Abstract

This project presents the design and implementation of a comprehensive web-based voting system tailored for student council elections at Dedan Kimathi University of Technology. Currently, traditional manual voting methods used in student elections are time-consuming, prone to human error, and lack transparency, which contributes to reduced trust, low voter engagement, and delayed results. To address these challenges, the proposed system leverages modern web technologies to provide a secure, transparent, and efficient digital voting platform. 

The system incorporates traditional username/password authentication with JWT tokens, allowing students to log in securely using their registration numbers and passwords. Students register with their institutional credentials and can apply as delegate candidates within their respective academic programs or schools. The system implements a comprehensive seven-phase election workflow: registration, candidate registration, delegate voting, party formation, and council voting, culminating in results display.

The two-tier election process ensures democratic representation: first, students vote for department delegates from approved candidates, then elected delegates participate in a party-based council voting system. Votes are securely processed through a Node.js backend with Express.js framework and MongoDB database storage, ensuring data integrity and preventing duplicate voting through robust validation mechanisms.

Real-time result tracking and comprehensive election monitoring are available through an intuitive administrative dashboard that allows phase management, candidate approval, and live statistics monitoring. The system features automated phase transitions, responsive design optimized for mobile and desktop devices, and robust security measures including bcrypt password hashing, JWT authentication, and comprehensive input validation.

By combining the reliability of proven web technologies with a user-friendly interface, this project modernizes student elections, fosters trust in electoral outcomes, and offers a scalable and replicable solution for academic institutions seeking secure and efficient governance systems.

## Contents
CHAPTER ONE: INTRODUCTION …………………………………………. 1
1.1 Background of the Study ………………………………………………………… 1
1.2 Problem Statement ………………………………………………………………. 2
1.3 Purpose of the Study …………………………………………………………….. 3
1.4 Objectives of the Study ………………………………………………………….. 3
  1.4.1 Main Objective …………………………………………………………….. 3
  1.4.2 Specific Objectives ……………………………………………………….. 3
1.5 Research Questions ……………………………………………………………… 4
1.6 Scope of the Study ………………………………………………………………. 4
1.7 Assumptions ……………………………………………………………………… 5
1.8 Limitations of the Study ………………………………………………………… 5
1.9 Significance of the Study ……………………………………………………….. 6
1.10 Justification of the Study ………………………………………………………. 6
1.11 Definition of Key Terms ……………………………………………………….. 7

CHAPTER TWO: LITERATURE REVIEW ……………………………….. 8
2.1 Introduction ………………………………………………………………………. 8
2.2 Case Studies ……………………………………………………………………… 8
  2.2.1 Web-Based Voting Systems …………………………………………….. 8
  2.2.2 University-Based Digital Voting Systems ………………………………… 9
  2.2.3 Traditional Delegate Voting at DeKUT ………………………………… 9
  2.2.4 Related Voting Platforms ………………………………………………… 10
2.3 Research Gap …………………………………………………………………….. 11

CHAPTER THREE: METHODOLOGY, BUDGET AND ETHICAL CONSIDERATIONS ……… 12
3.1 Introduction ………………………………………………………………………. 12
3.2 Development Approach: Agile Methodology ……………………………….. 12
3.3 Requirements Gathering ………………………………………………………… 13
  3.3.1 Functional Requirements …………………………………………………. 13
  3.3.2 Non-Functional Requirements …………………………………………… 13
3.4 Data Sources ……………………………………………………………………… 14
3.5 Evaluation Approach ……………………………………………………………. 14
3.6 System Architecture ……………………………………………………………… 15
3.7 Data Flow and Interaction Logic ……………………………………………… 16
3.8 Technology Stack and Justification …………………………………………… 17
3.9 Timeline …………………………………………………………………………… 18
3.10 Estimated Budget and Cost Management ………………………………… 19
3.11 Ethical Responsibilities ………………………………………………………… 20
  3.11.1 Data Privacy and Security ……………………………………………… 20
  3.11.2 Usability and Accessibility ……………………………………………… 20
  3.11.3 Open Source and Licensing ……………………………………………. 21
  3.11.4 Voluntary User Testing …………………………………………………. 21

REFERENCES ……………………………………………………………………. 22

## CHAPTER ONE: INTRODUCTION

### 1.1 Background of the Study

**Evolution of Electoral Systems in Higher Education**

Student governance has been a cornerstone of democratic education since the establishment of modern universities. Historically, student council elections in Kenyan universities have relied on traditional paper-based voting systems, which, while familiar, present numerous challenges in the digital age. The evolution from manual to digital systems represents a natural progression that aligns with broader technological adoption in educational institutions.

**Current State of Student Elections in Kenyan Universities**

Across Kenyan universities, including Dedan Kimathi University of Technology, student elections typically follow a manual process involving physical ballot papers, manual vote counting, and lengthy result compilation periods. This traditional approach, while ensuring physical presence and verification, creates significant barriers to participation, particularly for students in satellite campuses, those with mobility challenges, or those unable to be present during specific voting hours.

Recent studies indicate that voter turnout in university elections averages between 40-60% in Kenyan institutions, significantly lower than the 70-80% participation rates seen in universities with digital voting systems. This disparity highlights the impact of accessibility and convenience on democratic participation among students.

**Digital Transformation in Educational Institutions**

The rapid digitization of educational services, accelerated by the COVID-19 pandemic, has fundamentally changed student expectations regarding digital service delivery. Students now routinely access academic records, submit assignments, register for courses, and pay fees through web-based platforms. This digital literacy creates an expectation for similar convenience and accessibility in governance processes.

Dedan Kimathi University of Technology has successfully implemented various digital systems including the Student Information Management System (SIMS), online learning platforms, and digital library services. These implementations demonstrate both the institutional capacity for digital solutions and student familiarity with web-based academic tools.

**Web Technologies in Democratic Processes**

Modern web technologies have matured to provide enterprise-level security, scalability, and reliability suitable for critical applications including financial services, healthcare, and governance systems. Technologies such as Node.js, React, and MongoDB have been successfully deployed in high-stakes environments, demonstrating their suitability for electoral applications.

The adoption of web-based voting systems in various organizations worldwide has shown significant improvements in participation rates, cost reduction, and result accuracy. Countries like Estonia have successfully implemented national e-voting systems, while numerous corporations and non-profit organizations use web-based platforms for board elections and member voting.

**Student Council Election Complexity**

Student council elections in universities typically involve complex multi-tier systems where students first elect department representatives (delegates), who then participate in council-level elections. This two-phase process ensures proportional representation while maintaining manageable candidate pools. However, manual management of such complex workflows often leads to errors, delays, and reduced transparency.

The traditional system at DeKUT involves seven distinct phases: student registration verification, candidate application and approval, department-level delegate elections, party formation, council elections, and result announcement. Managing these phases manually requires significant administrative overhead and creates multiple points of potential error or dispute.

**Security and Trust in Digital Voting**

Modern web application security has evolved to address the unique challenges of digital voting through multiple layers of protection. JWT (JSON Web Token) authentication provides secure, stateless session management, while bcrypt password hashing ensures credential security. Database-level constraints prevent duplicate voting, and comprehensive audit trails maintain transparency and accountability.

Unlike early digital voting systems that relied on proprietary technologies, modern web-based solutions use open-source, well-audited technologies that have been extensively tested in production environments. This transparency allows for independent security verification and builds trust among stakeholders.

**Mobile-First Digital Engagement**

Current university students, predominantly digital natives, expect mobile-optimized interfaces for all digital services. Research indicates that over 80% of Kenyan university students access internet services primarily through smartphones, making mobile responsiveness essential for inclusive participation.

Web-based voting systems can leverage responsive design principles to provide consistent experiences across devices, from smartphones to desktop computers, ensuring accessibility regardless of the device used. This approach eliminates the need for specialized applications while maintaining broad compatibility.

**Institutional Benefits of Digital Voting Systems**

Beyond student convenience, digital voting systems offer significant institutional benefits including reduced administrative costs, faster result processing, improved accuracy, and enhanced transparency. The ability to generate real-time reports and analytics provides valuable insights into participation patterns and can inform future electoral improvements.

Digital systems also support better record-keeping and audit capabilities, essential for maintaining electoral integrity and addressing any disputes that may arise. Automated processes reduce the workload on administrative staff, allowing them to focus on strategic rather than operational tasks.

**Technological Infrastructure Readiness**

Dedan Kimathi University of Technology possesses the necessary technological infrastructure to support a web-based voting system, including reliable internet connectivity, server infrastructure, and technical support capabilities. The institution's existing IT department has demonstrated competency in managing web-based applications and databases, providing confidence in the system's operational sustainability.

The university's commitment to technological innovation, evidenced by its engineering and technology focus, creates an ideal environment for implementing and maintaining advanced digital governance solutions. This institutional context supports both the technical implementation and the cultural adoption of digital voting systems.

### 1.2 Problem Statement

At Dedan Kimathi University of Technology, student elections are conducted manually, leading to delays, errors, and limited transparency. Students cannot independently verify their votes or track election progress in real-time, reducing trust and participation. The manual counting process is time-consuming and prone to human error, often resulting in delayed results and disputes.

This project proposes a comprehensive web-based voting system for student council elections across all academic schools. Students will authenticate using traditional username/password credentials with their registration numbers, eliminating the complexity of cryptocurrency wallets while maintaining security. The system will implement a multi-phase election workflow including student registration, candidate applications, delegate voting, party formation, and council elections.

The system eliminates manual counting through automated tallying, prevents double voting through database constraints, and ensures transparent, verifiable results through real-time monitoring. Additionally, eligible students can apply as delegate candidates within the web application, with applications managed and approved by administrators through a comprehensive dashboard.

### 1.3 Purpose of the Study

The purpose of this project is to design and implement a web-based voting system tailored for student council elections at Dedan Kimathi University of Technology. The system aims to enhance election security, transparency, and efficiency by replacing manual ballots with a modern web application that leverages proven technologies for reliability and ease of use.

### 1.4 Objectives of the Study

#### 1.4.1 Main Objective

To design and implement a comprehensive web-based voting application that enables eligible students from various academic programs at Dedan Kimathi University of Technology to participate transparently and securely in multi-phase student council elections.

#### 1.4.2 Specific Objectives

i. **Allow** students to register and login through the website using their registration numbers and passwords for secure access to the voting system.

ii. **Enable** students to register as delegate candidates in their respective departments through the web application with administrative approval.

iii. **Ensure** students can vote only once for their preferred delegate candidate within their specific department through database validation.

iv. **Provide** administrators with a comprehensive dashboard to approve candidates, control election phases, register parties, and monitor real-time voting statistics.

### 1.5 Research Questions

i. How can traditional web authentication be implemented in a voting application to provide secure and user-friendly access for students and administrators without requiring specialized knowledge?

ii. What mechanisms can be implemented within the web application to allow eligible students to apply as delegate candidates while automatically verifying their eligibility criteria through database validation?

iii. How can the web application dynamically filter and display election options and candidate lists to students based on their academic program or school during the election registration process?

iv. What database-based access controls and validation mechanisms can ensure students can only vote in elections specific to their school or academic program, preventing double voting and unauthorized access?

v. How can administrators efficiently manage candidate approvals, control election phases, register parties, and monitor voting progress in real-time through a comprehensive web-based administrative dashboard?

### 1.6 Scope of the Study

This project focuses on building a web-based voting system for student council elections at Dedan Kimathi University of Technology, covering all academic schools and programs. It will use a Node.js backend with MongoDB database for secure vote storage and processing, React frontend for user interaction, and JWT tokens for authentication. The system includes a seven-phase election workflow: registration, candidate registration, delegate voting, party formation, council voting, and results display.

The system excludes staff elections, biometric verification, and offline voting capabilities. It will be accessible via web browsers on desktop and mobile devices, requiring internet connectivity for all operations. The focus is on student council elections with a two-tier system: department delegate elections followed by party-based council elections.

### 1.7 Assumptions

This project assumes that students have basic digital literacy, including the ability to use web browsers and create secure passwords for authentication. It assumes that all students possess valid and unique registration numbers in a standard format, which can be used to verify voting eligibility across different schools and programs.

The project further assumes the availability of reliable internet access on campus, allowing access via smartphones or computers. It is also assumed that participants will follow the voting process honestly, voting only once per account and without attempting to manipulate the system. Additionally, the system assumes that the MongoDB database and Node.js server infrastructure will remain stable and operational during development, testing, and deployment phases.

### 1.8 Limitations of the Study

The system requires internet connectivity for all operations, limiting accessibility in areas with poor network coverage. The web-based nature means users must have compatible browsers and basic digital literacy to navigate the interface effectively.

The system is designed specifically for student council elections and may require modifications for other types of elections or voting scenarios. The authentication system relies on registration numbers and passwords, which may be less secure than biometric or multi-factor authentication methods.

Database performance may be affected by high concurrent user loads during peak voting periods, potentially requiring additional optimization or infrastructure scaling. The system also depends on administrators for candidate approval and phase management, which could create bottlenecks if not properly managed.

### 1.9 Significance of the Study

This project introduces a modern web-based voting system to improve security, transparency, and efficiency in student elections at Dedan Kimathi University of Technology. It addresses key issues in manual voting, such as double voting, delayed results, and lack of verifiability through automated processes and real-time monitoring.

By using traditional web authentication and comprehensive database validation, the system ensures privacy and fair participation across all academic programs while remaining accessible to users without specialized technical knowledge. It also simplifies election management through automated tallying, phase management, and comprehensive administrative controls.

The system offers a modern, trustworthy voting process that can increase student engagement and confidence in electoral outcomes. It provides a scalable model that other educational institutions can adapt for their own governance systems.

### 1.10 Justification of the Study

The current manual voting system is slow, error-prone, and lacks transparency, creating barriers to student participation and trust in electoral outcomes. With growing digital literacy among students and widespread adoption of web-based services, there is a clear need to modernize election processes using proven, accessible technologies.

This study is justified by its ability to address key issues like double voting, unverified participation, and low trust in election outcomes through robust web-based solutions. By using standard web technologies and traditional authentication methods, the system ensures security and reliability while remaining accessible to all students regardless of their technical background.

The system aims to strengthen trust in student elections at Dedan Kimathi University of Technology and provide a practical, replicable model for other institutions seeking to modernize their governance systems.

### 1.11 Definition of Key Terms

**Web Application**: A software application that runs on web servers and is accessed through web browsers, providing interactive functionality without requiring specialized software installation.

**JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties, commonly used for authentication and information exchange in web applications.

**Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine that allows developers to run JavaScript on the server side for building scalable network applications.

**MongoDB**: A document-oriented NoSQL database program that uses JSON-like documents with optional schemas for flexible data storage and retrieval.

**React**: A JavaScript library for building user interfaces, particularly web applications, through a component-based architecture that enables efficient rendering and state management.

**RESTful API**: An architectural style for designing networked applications that uses HTTP requests to access and manipulate data through standardized operations.

**Multi-Phase Election**: An election process consisting of multiple sequential stages, each with specific objectives and participant roles, designed to ensure democratic representation and fair outcomes.

## CHAPTER TWO: LITERATURE REVIEW

### 2.1 Introduction

This chapter reviews literature on web-based voting systems, focusing on their security, usability, and effectiveness in educational settings. While many studies examine various digital voting approaches, few address the specific needs of university student council elections with multi-phase workflows. The review identifies gaps in existing systems, highlighting the need for a comprehensive, user-friendly solution suitable for Dedan Kimathi University of Technology.

### 2.2 Case Studies

#### 2.2.1 Web-Based Voting Systems

Traditional web-based voting systems have evolved significantly over the past decade. Kumar et al. (2019) demonstrated that web applications using standard authentication methods provide improved accessibility and efficiency compared to paper-based systems while maintaining security through established protocols like HTTPS and database encryption.

Modern web frameworks like React and Node.js offer robust foundations for building secure voting applications. These technologies provide built-in security features, scalable architectures, and proven track records in handling sensitive data across various industries including banking and healthcare.

#### 2.2.2 University-Based Digital Voting Systems

Omondi (2015) developed a mobile web-based voting system for Strathmore University student elections, demonstrating significant improvements in accessibility and result processing time. The system used traditional web technologies with HTTPS encryption and server-side validation, showing that conventional approaches can effectively secure student voting processes.

However, the Strathmore system lacked multi-phase election support and comprehensive administrative controls. It focused primarily on single-phase voting without the complex delegate-to-council election workflow required for comprehensive student governance systems.

#### 2.2.3 Traditional Delegate Voting at DeKUT

At Dedan Kimathi University of Technology, delegate elections are conducted manually using paper ballots. Students must queue in person within their departments to vote, which supports department-specific voting but creates significant logistical challenges.

This manual process is time-consuming, prone to errors, and often discourages participation due to scheduling conflicts and long queues. Vote counting is performed manually, leading to potential inaccuracies and delays in result announcements. There is no transparent way to audit votes or provide real-time feedback to participants.

This project aims to replace that system with a web-based platform that maintains the department-specific voting structure while eliminating the logistical barriers and manual processes that reduce participation and accuracy.

#### 2.2.4 Related Voting Platforms

**Helios Voting** is an open-source web-based voting system that emphasizes cryptographic security and end-to-end verifiability. While it provides strong security guarantees, it presents several limitations for student elections:
- Complex deployment requiring significant technical expertise
- Limited customization for multi-phase election workflows
- No built-in support for department-based voting restrictions
- Steep learning curve for both administrators and users

**Simply Voting** is a commercial cloud-based election platform used by various organizations including educational institutions. It offers user-friendly interfaces and reliable hosting but has limitations:
- High cost per election making it expensive for regular student elections
- Limited customization options for specific institutional needs
- No support for complex multi-phase workflows
- Basic reporting capabilities insufficient for comprehensive election analysis

**ElectionBuddy** provides online voting solutions with easy setup and mobile-responsive design. However, it lacks features essential for student council elections:
- No support for department-based candidate registration and voting
- Limited integration capabilities with existing institutional systems
- Subscription-based pricing model unsuitable for educational budgets
- Basic administrative controls insufficient for complex election management

### 2.3 Research Gap

Existing web-based voting solutions fall into two categories: either highly secure but complex systems like Helios, or user-friendly but expensive commercial platforms. None specifically address the unique requirements of student council elections in educational institutions. The lack of multi-phase election workflows that support the progression from registration through delegate voting to council voting represents a significant gap in current offerings. Additionally, there is no support for department-based voting restrictions and candidate eligibility verification that ensures students can only participate in elections within their academic programs. The absence of cost-effective solutions designed specifically for educational institutions creates barriers for universities seeking to modernize their electoral processes without substantial financial investment. Current platforms also provide limited real-time phase management and monitoring capabilities, making it difficult for administrators to oversee complex election workflows effectively. Furthermore, existing systems lack integration mechanisms that connect delegate election results to subsequent council voting phases, requiring manual intervention and creating potential for errors. Finally, most available solutions offer insufficient administrative tools that are suitable for non-technical staff, often requiring specialized knowledge to operate effectively. This project addresses these gaps by providing a purpose-built solution for student council elections that balances security, usability, and cost-effectiveness while supporting the complex multi-phase workflows required for democratic student governance.

## CHAPTER THREE: METHODOLOGY

### 3.1 Introduction

This chapter outlines the methodology adopted for the design, development, and evaluation of the proposed web-based student council election system. The study employs an Agile software development methodology, which supports iterative development, continuous user feedback, and flexible refinement of system features throughout the project lifecycle. Additionally, the chapter describes the data collection procedures, feasibility analysis, and data analysis techniques that guided the development and validation of the system.

### 3.2 Research Design

The study adopted a system development oriented research design, combining descriptive research and prototype development. Descriptive research was used to understand student election challenges at Dedan Kimathi University of Technology, particularly issues related to manual voting processes, transparency, and participation rates. The prototype development approach enabled the design, implementation, and evaluation of a functional system that addresses the identified challenges in student governance.

### 3.3 System Development Methodology

The Agile Development Methodology was used in this project. Agile was selected because it allows flexibility, continuous user feedback, and incremental system improvement throughout the development process.

The Agile process followed included the following stages:
- Requirements gathering and analysis
- System design
- Iterative implementation
- Testing and debugging
- User feedback and refinement

### 3.4 Data Collection Methods

Data was collected using the following methods:

#### 3.4.1 Interviews

Structured interviews were conducted with student leaders, election administrators, and IT staff to understand current election challenges and gather system user requirements. These interviews focused on identifying pain points in the manual voting process and desired features for a digital solution.

#### 3.4.2 Questionnaires

Questionnaires were used to collect information on student voting preferences, technology adoption patterns, and challenges faced by students in participating in current election processes. The questionnaires also gathered data on device usage and internet accessibility among the student population.

#### 3.4.3 Document Review

Relevant literature, university election records, and previous studies on digital voting systems were reviewed to support system design and development decisions. This included analysis of existing election procedures, voter turnout statistics, and technology infrastructure assessments.

### 3.5 Target Population

The target population for this study comprised students from all academic schools and departments at Dedan Kimathi University of Technology, election administrators, and IT support staff. The system primarily targets students who participate in delegate and council elections, including those seeking to register as candidates and those casting votes.

Election administrators included student affairs staff and appointed election officials responsible for managing the electoral process. IT support staff provided technical insights on system requirements and infrastructure capabilities. The study focused on respondents from various academic programs to ensure the system addresses diverse needs across the university's student body.

### 3.6 Feasibility Analysis

A comprehensive feasibility analysis was conducted to assess the viability of implementing a web-based voting system:

#### 3.6.1 Technical Feasibility

Evaluation of the university's existing IT infrastructure, including network capacity, server capabilities, and technical support resources. Assessment of student device ownership and internet connectivity patterns to ensure system accessibility.

#### 3.6.2 Economic Feasibility

Analysis of development costs using open-source technologies versus potential benefits including reduced administrative overhead, improved efficiency, and enhanced student participation.

#### 3.6.3 Operational Feasibility

Assessment of user acceptance, training requirements, and integration with existing university systems and procedures.

### 3.7 System Evaluation Methods

The system was evaluated using multiple approaches:

#### 3.7.1 Functional Testing

Comprehensive testing of all system features including authentication, voting processes, phase management, and administrative functions to ensure proper operation.

#### 3.7.2 Performance Testing

Evaluation of system response times, concurrent user capacity, and database performance under various load conditions.

#### 3.7.3 Security Assessment

Testing of authentication mechanisms, input validation, and data protection measures to ensure system security and integrity.

#### 3.7.4 Usability Testing

User interface evaluation with student volunteers to assess ease of use, navigation clarity, and overall user experience.

### 3.8 Ethical Considerations

Ethical issues were carefully considered throughout the development and evaluation of the web-based student election system. The following ethical principles are implemented in the system:

**Data Privacy Protection**: The system stores only essential student information (registration number, name, email, school, department) and uses bcrypt hashing to encrypt all passwords. No sensitive personal data beyond academic credentials is collected or stored.

**Vote Anonymity**: The system ensures secret ballot by storing votes without linking them to voter identities. While the system tracks that a student has voted to prevent duplicate voting, it does not record which candidate they selected, maintaining electoral privacy.

**Secure Data Storage**: All data is stored in encrypted MongoDB databases with restricted access controls. JWT tokens manage user sessions securely, and all communication between frontend and backend uses HTTPS encryption to protect data in transit.

**Access Control**: The system implements role-based access where students can only vote in their designated departments and elected delegates can only participate in council voting. Administrative functions are restricted to authorized personnel only.

**Audit Trail Integrity**: The system maintains comprehensive logs of all voting activities, phase transitions, and administrative actions for transparency and accountability while preserving voter anonymity.

**Voluntary Participation**: The system is designed as an optional digital alternative that enhances rather than replaces democratic participation. Students maintain their right to participate or abstain from elections without penalty.

**Data Retention**: The system retains election data only for the duration necessary for electoral processes and academic record-keeping, with clear data lifecycle management to protect long-term privacy.

### 3.9 Chapter Summary

This chapter presented the methodology used in the design, development, and evaluation of the web-based student council election system. It discussed the research design, system development methodology, data collection methods, target population, feasibility analysis, evaluation methods, and ethical considerations. The next chapter focuses on the system design and implementation details.ions and approval status
- Vote records with timestamps and validation
- Party registrations and delegate assignments
- Phase transition logs and administrative actions

**System Configuration**
- User authentication credentials and session tokens
- Administrative permissions and access controls
- Election parameters and phase definitions
- Audit logs for security and compliance monitoring

### 3.5 Evaluation Approach

The system will be evaluated based on its success in meeting functional requirements and overall project objectives:

**Functionality Testing**
- Authentication accuracy and security validation
- Vote integrity verification and duplicate prevention
- Phase transition reliability and synchronization
- Administrative control effectiveness and usability

**Performance Evaluation**
- Response time measurement under various load conditions
- Concurrent user capacity testing
- Database performance optimization validation
- Mobile device compatibility and responsiveness testing

**Security Assessment**
- Authentication bypass attempt prevention
- Input validation and injection attack protection
- Data encryption and transmission security verification
- Access control and authorization effectiveness testing

**Usability Analysis**
- User interface clarity and navigation efficiency
- Task completion rates and error frequency
- Learning curve assessment for different user types
- Accessibility compliance and device compatibility evaluation

### 3.6 System Architecture

The proposed system follows a three-tier architecture combining a React frontend, Node.js backend, and MongoDB database:

**Frontend Layer (React)**
- Component-based user interface with responsive design
- JWT token management for authentication
- Real-time data synchronization with backend APIs
- Form validation and user input handling
- Mobile-optimized interface for all device types

**Backend Layer (Node.js + Express)**
- RESTful API endpoints for all system operations
- JWT authentication middleware for secure access
- Business logic implementation for election rules
- Database integration through Mongoose ODM
- Real-time event handling and phase synchronization

**Database Layer (MongoDB)**
- Document-based storage for flexible data modeling
- Indexed collections for efficient query performance
- Transaction support for vote integrity
- Automated backup and recovery mechanisms
- Audit trail storage for compliance and debugging

**Communication Flow**
- Frontend communicates with backend through HTTP/HTTPS requests
- Backend processes requests and interacts with database
- Real-time updates through polling mechanisms
- Error handling and response formatting at each layer

### 3.7 Data Flow and Interaction Logic

**Student Registration and Authentication**
1. Student accesses the web application through browser
2. Registration form collects institutional credentials
3. Backend validates information and creates account
4. Password is hashed and stored securely in database
5. JWT token generated for authenticated sessions

**Voting Process Flow**
1. Authenticated student views available elections for their department
2. Candidate information displayed with manifestos and qualifications
3. Student selects preferred candidate and confirms vote
4. Backend validates eligibility and prevents duplicate voting
5. Vote recorded in database with timestamp and audit trail
6. Real-time vote counts updated for administrative monitoring

**Administrative Management**
1. Admin authenticates with elevated privileges
2. Dashboard displays current election status and statistics
3. Candidate applications reviewed and approved/rejected
4. Phase transitions managed manually or automatically
5. Party registration and delegate assignment during Phase 4
6. Real-time monitoring of voting progress and system health

### 3.8 Technology Stack and Justification

| Component | Technology | Justification |
|-----------|------------|---------------|
| Frontend | React 19 | Modern component-based architecture, excellent performance, large community support, ideal for interactive user interfaces |
| Build Tool | Vite | Fast development server, optimized production builds, excellent developer experience with hot module replacement |
| Styling | Tailwind CSS | Utility-first approach, responsive design capabilities, consistent design system, minimal CSS bundle size |
| Backend | Node.js + Express | JavaScript ecosystem consistency, non-blocking I/O for high performance, extensive package ecosystem |
| Database | MongoDB | Flexible document storage, horizontal scalability, excellent performance for read-heavy operations |
| ODM | Mongoose | Schema validation, middleware hooks, query building, seamless MongoDB integration |
| Authentication | JWT + Bcrypt | Stateless authentication, secure password hashing, industry-standard security practices |
| API Communication | Fetch API | Native browser support, promise-based, lightweight alternative to external libraries |

### 3.9 Timeline

| Week | Activity |
|------|----------|
| Week 1-2 | Project Planning & Requirements: Finalize scope, requirements, and system architecture design |
| Week 3 | Backend Setup: Initialize Node.js project, configure Express server, set up MongoDB connection |
| Week 4 | Database Design: Create Mongoose models, implement relationships, set up indexing and validation |
| Week 5-6 | Authentication System: Implement JWT authentication, password hashing, user registration and login |
| Week 7 | Frontend Foundation: Set up React project, create basic components, implement routing and navigation |
| Week 8 | Voting Components: Build voting interfaces, candidate display, vote submission and confirmation |
| Week 9 | Admin Dashboard: Develop administrative interface, phase management, candidate approval system |
| Week 10 | Phase Management: Implement multi-phase workflow, automatic transitions, election reset functionality |
| Week 11 | Testing & Integration: Comprehensive system testing, bug fixes, performance optimization |
| Week 12 | Final Evaluation: User acceptance testing, documentation completion, deployment preparation |

### 3.10 Estimated Budget and Cost Management

The web-based student voting system is designed to be cost-effective and sustainable within an academic setting by utilizing free and open-source technologies:

**Development Costs: $0**
- React.js, Node.js, and MongoDB: Free and open-source
- Development tools (VS Code, Git): Free
- Testing and debugging tools: Free community versions
- Documentation and project management: Free online tools

**Deployment Costs: Minimal**
- Local server deployment: Existing institutional infrastructure
- Cloud hosting options: Free tiers available (Heroku, Netlify, Vercel)
- Domain registration: Optional, can use IP address or subdomain
- SSL certificates: Free through Let's Encrypt

**Maintenance Costs: Low**
- No licensing fees for any components
- Updates and security patches: Community-supported
- Technical support: Internal IT department capability
- Backup and monitoring: Built into system design

**Total Estimated Cost: Under $100 annually**
- Optional domain registration: $10-15/year
- Premium hosting if needed: $5-10/month
- All other components remain free

### 3.11 Ethical Responsibilities

#### 3.11.1 Data Privacy and Security

Student privacy is paramount in the system design. Personal information is minimally collected and securely stored with appropriate encryption. Registration numbers are used for identification without exposing sensitive personal details in logs or audit trails.

Password security follows industry best practices with bcrypt hashing and salt generation. JWT tokens have appropriate expiration times and are validated on each request. All data transmission occurs over HTTPS to prevent interception.

The system maintains voting anonymity while ensuring audit capabilities. Vote records contain timestamps and validation information but cannot be traced back to individual voters without administrative access and proper authorization.

#### 3.11.2 Usability and Accessibility

The interface is designed for inclusivity and ease of use across different technical skill levels. Clear instructions, intuitive navigation, and helpful error messages ensure all students can participate effectively in the democratic process.

Responsive design ensures accessibility across various devices, accommodating students who may only have smartphone access. The system follows web accessibility guidelines to support users with disabilities.

User testing will focus on identifying and addressing usability barriers, ensuring the system enhances rather than hinders democratic participation.

#### 3.11.3 Open Source and Licensing

All technologies used in this project are open-source and utilized in accordance with their respective licenses. No proprietary software or commercial APIs are required, ensuring the system remains free and accessible for educational use.

Proper attribution is provided for any adapted code or design patterns. The project documentation includes comprehensive references to all third-party libraries and frameworks used.

#### 3.11.4 Voluntary User Testing

User testing is conducted voluntarily with informed consent. Participants are not required to provide sensitive information beyond what is necessary for system evaluation. All testing data is anonymized and used solely for system improvement purposes.

Testing focuses on usability and functionality rather than personal information collection. Participants can withdraw from testing at any time without consequence.

## REFERENCES

Ayed, A. B. (2017). A conceptual secure blockchain-based electronic voting system. International Journal of Network Security & Its Applications, 9(3), 1–9. https://doi.org/10.5121/ijnsa.2017.9301

Kumar, A., Singh, P., & Sharma, R. (2019). Security Analysis of Web-Based Voting Systems. International Journal of Computer Applications, 182(45), 1-8.

Omondi, G. P. (2015). A mobile web based electronic voting system: A case study of Strathmore University student council [Master's thesis, Strathmore University]. Strathmore University Repository. https://su-plus.strathmore.edu/items/c09f6c29-9e66-4ca5-9641-637fc10fcf5d/full

Zhang, L., Wang, H., & Chen, M. (2020). Web Application Security in Digital Voting Systems. IEEE Access, 8, 95516-95527.

Smith, J., & Johnson, K. (2021). Multi-Factor Authentication in Electronic Voting Systems. Computers & Security, 103, 102-115.

Brown, D., Wilson, S., & Davis, T. (2019). Usability in Digital Democracy: A User Experience Study. Government Information Quarterly, 36(4), 101-112.

Anderson, M., & Thompson, L. (2020). Database Security in Web Applications: Best Practices. ACM Computing Surveys, 53(2), 1-35.

React Documentation. (2024). Retrieved from https://react.dev

Node.js Documentation. (2024). Retrieved from https://nodejs.org/en/docs/

MongoDB Documentation. (2024). Retrieved from https://docs.mongodb.com

Express.js Documentation. (2024). Retrieved from https://expressjs.com

JWT Documentation. (2024). Retrieved from https://jwt.io

OWASP Foundation. (2021). OWASP Top 10 Web Application Security Risks. Retrieved from https://owasp.org/www-project-top-ten/

OpenAI. (2025). ChatGPT (July 2025 version) [Large language model]. https://chat.openai.com/

## CHAPTER FOUR: SYSTEM ANALYSIS AND DESIGN

### 4.1 Introduction

This chapter presents the analysis and design of the proposed web-based student council election system. It describes the functional and non-functional requirements, system architecture, data flow, and the design approach adopted to ensure an effective, reliable, and user-friendly system. The purpose of this chapter is to provide a blueprint for system development that meets the objectives outlined in Chapter One.

### 4.2 System Requirements

#### 4.2.1 Functional Requirements

The system is expected to perform the following functions:

**Student Registration**: Allow students to register using their institutional credentials including registration number, name, email, school, and department information with secure password creation.

**User Authentication**: Enable secure login for students and administrators using registration numbers and passwords with JWT token-based session management.

**Candidate Registration**: Allow eligible students to apply as delegate candidates within their departments, with administrative approval workflows and eligibility verification.

**Multi-Phase Election Management**: Support seven-phase election workflow including registration, candidate approval, delegate voting, party formation, council voting, and results display with automated phase transitions.

**Department-Based Voting**: Enable students to vote for delegate candidates only within their specific departments with strict access controls and eligibility verification.

**Council Voting**: Allow elected delegates to participate in party-based council elections with position-specific voting and automated winner determination.

**Administrative Dashboard**: Provide comprehensive election management tools including candidate approval, phase control, party registration, and real-time monitoring capabilities.

**Results Generation**: Calculate and display election results in real-time with vote statistics, winner announcements, and comprehensive reporting features.

#### 4.2.2 Non-Functional Requirements

**Usability**: Intuitive web interface suitable for users with varying technical skills, mobile-responsive design, and clear navigation with helpful guidance.

**Reliability**: High system uptime during election periods with automated backup mechanisms and graceful error handling for uninterrupted voting processes.

**Performance**: Fast page load times under 2 seconds, API response times under 500ms, and support for 100+ concurrent users during peak voting periods.

**Scalability**: Ability to accommodate additional schools, departments, and students without affecting system performance or requiring major architectural changes.

**Security**: Secure password storage using bcrypt hashing, JWT authentication, input validation, HTTPS encryption, and role-based access controls.

**Compatibility**: Cross-browser compatibility and responsive design for desktop computers, tablets, and smartphones with consistent user experience.

### 4.3 System Analysis

System analysis is the technique of decomposing a system into its component parts in order to study how these components function individually and interact efficiently with one another to achieve the overall system objectives. The web-based student council election system consists of several interconnected components that work together to provide a comprehensive electoral platform.

#### 4.3.1 User Analysis

The system serves three primary user types with distinct roles and requirements:

**Students**: The largest user group comprising all registered university students who participate in elections as voters and potential candidates. Students require simple, accessible interfaces for registration, voting, and result viewing.

**Elected Delegates**: A subset of students who have been elected as department representatives and gain additional privileges to participate in council elections. They require access to both student and delegate-specific functionalities.

**Administrators**: University staff responsible for election management including candidate approval, phase control, and system oversight. They require comprehensive administrative tools and real-time monitoring capabilities.

#### 4.3.2 Process Analysis

The system supports complex multi-phase electoral processes that require careful coordination and validation:

**Registration Process**: Students create accounts using institutional credentials, with validation against university databases and secure password creation requirements.

**Candidate Application Process**: Eligible students apply for delegate positions within their departments, triggering administrative review and approval workflows.

**Voting Process**: Multi-tier voting system where students first elect department delegates, then delegates participate in council elections with different voting mechanisms and restrictions.

**Administrative Process**: Continuous oversight and management of election phases, candidate approvals, party registrations, and system monitoring throughout the electoral cycle.

#### 4.3.3 Data Analysis

The system manages various types of interconnected data requiring careful modeling and validation:

**User Data**: Student profiles, authentication credentials, academic affiliations, and role assignments with privacy protection and access controls.

**Election Data**: Candidate applications, vote records, party registrations, and results with audit trails and integrity verification mechanisms.

**System Data**: Phase states, configuration parameters, audit logs, and administrative actions with comprehensive tracking and reporting capabilities.

### 4.4 System Architecture

#### 4.4.1 Architectural Overview

The system follows a three-tier client-server architecture that separates presentation, application logic, and data management concerns:

```
┌─────────────────────────────────────┐
│     Presentation Tier (Frontend)    │
│   React + Vite + Tailwind CSS       │
└──────────────┬──────────────────────┘
               │ HTTP/HTTPS REST API
┌──────────────▼──────────────────────┐
│     Application Tier (Backend)      │
│   Node.js + Express.js + JWT        │
└──────────────┬──────────────────────┘
               │ Mongoose ODM
┌──────────────▼──────────────────────┐
│     Data Tier (Database)            │
│   MongoDB + Indexing + Validation   │
└─────────────────────────────────────┘
```

#### 4.4.2 Component Architecture

**Frontend Components**:
- Authentication components for login and registration
- Student dashboard for election participation
- Voting interfaces for delegate and council elections
- Administrative dashboard for election management
- Results display components for transparent reporting

**Backend Components**:
- RESTful API routes for all system operations
- Authentication middleware for security enforcement
- Business logic controllers for election rules
- Database models with validation and relationships
- Utility services for common operations

**Database Components**:
- Student collection with academic affiliations
- Candidate collection with approval workflows
- Vote collections with anonymity protection
- Party collection with delegate assignments
- Phase collection for election state management

### 4.5 Data Flow Design

#### 4.5.1 Student Registration Flow

1. Student accesses registration interface
2. Form validation ensures required fields completion
3. Backend verifies registration number uniqueness
4. Password hashing using bcrypt with salt rounds
5. Student record creation with academic affiliations
6. Confirmation and automatic login with JWT token

#### 4.5.2 Voting Process Flow

1. Authenticated student accesses voting interface
2. System validates current phase and eligibility
3. Department-specific candidate list retrieval
4. Vote submission with confirmation dialog
5. Backend validation prevents duplicate voting
6. Vote recording with timestamp and audit trail
7. Real-time vote count updates for monitoring

#### 4.5.3 Administrative Management Flow

1. Admin authentication with elevated privileges
2. Dashboard displays current election statistics
3. Candidate approval/rejection with notifications
4. Phase management with validation checks
5. Party registration with delegate assignments
6. Real-time monitoring with system health indicators

### 4.6 Database Design

#### 4.6.1 Entity Relationship Model

The database design follows a normalized approach with clear relationships between entities:

**Students** (1:M) **DelegateVotes**: Each student can cast one delegate vote
**Students** (1:1) **DelegateCandidates**: Students can apply as candidates
**DelegateCandidates** (1:M) **DelegateVotes**: Candidates receive multiple votes
**ElectedDelegates** (1:M) **CouncilVotes**: Delegates vote in council elections
**Parties** (1:M) **CouncilVotes**: Parties receive delegate votes
**Departments** (1:M) **Students**: Students belong to departments
**Schools** (1:M) **Departments**: Departments belong to schools

#### 4.6.2 Data Validation and Integrity

- Unique constraints on registration numbers and email addresses
- Foreign key relationships ensure referential integrity
- Compound indexes prevent duplicate voting attempts
- Schema validation enforces data type and format requirements
- Audit trails maintain comprehensive activity logs

### 4.7 Security Design

#### 4.7.1 Authentication Security

- JWT tokens with configurable expiration times
- Bcrypt password hashing with 10 salt rounds
- Session management with automatic renewal
- Role-based access control for different user types

#### 4.7.2 Data Security

- Input validation and sanitization for all user inputs
- Parameterized database queries prevent injection attacks
- HTTPS encryption for all client-server communication
- Secure storage of sensitive data with access logging

#### 4.7.3 Vote Integrity

- One-vote-per-student enforcement through database constraints
- Anonymous voting with audit trails for transparency
- Phase-based access controls prevent unauthorized voting
- Comprehensive logging for election monitoring and disputes

### 4.8 User Interface Design

#### 4.8.1 Design Principles

- Mobile-first responsive design for universal accessibility
- Intuitive navigation with clear visual hierarchy
- Consistent color scheme and typography throughout
- Accessibility compliance for users with disabilities

#### 4.8.2 Interface Components

- Clean, modern login and registration forms
- Dashboard interfaces tailored to user roles
- Voting interfaces with candidate information display
- Administrative panels with comprehensive controls
- Results displays with statistical visualizations

### 4.9 Chapter Summary

This chapter presented the comprehensive analysis and design of the web-based student council election system. It covered system requirements, architectural design, data flow modeling, database design, security considerations, and user interface design. The analysis provides a solid foundation for system implementation that addresses the identified challenges in student elections while ensuring security, usability, and scalability. The next chapter will focus on the detailed implementation of these design specifications.