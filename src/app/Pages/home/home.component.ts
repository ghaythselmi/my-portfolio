import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

interface ProjectDetail {
  title: string; subtitle: string; category: string; image: string;
  images?: string[];
  description: string; technologies: string[]; features: string[];
  liveUrl: string; githubUrl: string;
}

interface T {
  navHome: string; navEducation: string; navAbout: string;
  navExperience: string; navWork: string; navContact: string; navCta: string;
  heroBadge: string; heroSubtitle: string; heroDesc: string; heroContact: string; heroCV: string;
  sectionEducation: string;
  edu1Degree: string; edu1School: string; edu1Date: string;
  edu2Degree: string; edu2School: string; edu2Date: string;
  sectionAbout: string; aboutIntro: string;
  skill1Title: string; skill1Desc: string;
  skill2Title: string; skill2Desc: string;
  skill3Title: string; skill3Desc: string;
  sectionExperience: string;
  exp1Title: string; exp1Company: string; exp1Date: string;
  exp1li1: string; exp1li2: string; exp1li3: string;
  exp2Title: string; exp2Company: string; exp2Date: string;
  exp2li1: string; exp2li2: string; exp2li3: string;
  sectionCertifications: string; sectionCertSubtitle: string;
  btnViewCert: string; modalIssueDate: string; modalIssuer: string;
  modalSkills: string; btnVerify: string;
  sectionWork: string; sectionWorkSubtitle: string; btnViewProject: string;
  modalTech: string; modalAbout: string; modalFeatures: string;
  sectionContact: string; sectionContactSubtitle: string;
  contactEmail: string; contactLinkedIn: string; contactGitHub: string;
  footerTagline: string; footerQuickLinks: string; footerTechStack: string;
  footerFrontBack: string; footerDatabases: string; footerCloud: string; footerTools: string;
  footerHome: string; footerAbout: string; footerExperience: string; footerProjects: string;
  footerCopyright: string; footerStatus: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentLang: 'en' | 'fr' = 'en';
  selectedProject: string | null = null;
  selectedCertificate: string | null = null;
  isScrolled = false;

  @ViewChild('navMenu') navMenu!: ElementRef;
  @ViewChild('hamburger') hamburger!: ElementRef;

  // ── Translations ────────────────────────────────────────────
  private translations: Record<'en' | 'fr', T> = {
    en: {
      navHome: 'Home', navEducation: 'Education', navAbout: 'About',
      navExperience: 'Experience', navWork: 'Work', navContact: 'Contact',
      navCta: "Let's Connect",
      heroBadge: 'Available for Work',
      heroSubtitle: 'Full-Stack & DevOps Engineer',
      heroDesc: 'Recently graduated from ESPRIT, with a strong foundation in full-stack development and DevOps. Building scalable applications and deploying them with precision.',
      heroContact: 'Get In Touch', heroCV: 'Download CV',
      sectionEducation: 'Education',
      edu1Degree: 'Cloud Computing Engineering', edu1School: 'ESPRIT', edu1Date: '2020 - 2025',
      edu2Degree: 'Scientific Baccalaureate', edu2School: 'Pioneer High School Gabès', edu2Date: '2015 - 2019',
      sectionAbout: 'About Me',
      aboutIntro: "I'm specializing in full-stack development and DevOps, with experience building end-to-end applications and deploying them using modern cloud and CI/CD practices. I work comfortably with frontend frameworks, backend APIs, databases, and containerized environments.",
      skill1Title: 'Web Development', skill1Desc: 'Angular, Symfony, .NET, Spring Boot',
      skill2Title: 'Databases', skill2Desc: 'MySQL, PostgreSQL, MongoDB',
      skill3Title: 'Cloud & DevOps', skill3Desc: 'Docker, Kubernetes, Jenkins, Nginx, SonarQube, Grafana, Prometheus, Ansible',
      sectionExperience: 'Experience',
      exp1Title: 'Full Stack Developer Intern', exp1Company: 'Spofun', exp1Date: 'Feb 2025 - Aug 2025',
      exp1li1: 'Developed full-stack sports coaching platform using Angular and Spring Boot',
      exp1li2: 'Implemented RESTful APIs and real-time features for athlete-coach interaction',
      exp1li3: 'Built CI/CD pipelines using Jenkins, Docker, and Docker Compose',
      exp2Title: 'Full Stack Developer Intern', exp2Company: 'ChyrineProd', exp2Date: 'Jul 2024 - Sep 2024',
      exp2li1: 'Developed web application to monitor website availability and SSL certificate status',
      exp2li2: 'Designed and implemented responsive UIs using Angular',
      exp2li3: 'Implemented server-side features using Symfony and MySQL',
      sectionCertifications: 'Certifications',
      sectionCertSubtitle: 'Professional certifications demonstrating expertise in cloud technologies and DevOps practices.',
      btnViewCert: ' View Certificate', modalIssueDate: 'Issue Date',
      modalIssuer: 'Issuing Organization', modalSkills: 'Skills Covered', btnVerify: 'Verify Certificate',
      sectionWork: 'Featured Work', sectionWorkSubtitle: 'Recent projects showcasing full-stack capabilities',
      btnViewProject: 'View Project', modalTech: 'Technologies', modalAbout: 'About', modalFeatures: 'Features',
      sectionContact: "Let's Connect", sectionContactSubtitle: 'Open to collaborations and exciting projects',
      contactEmail: 'Email', contactLinkedIn: 'LinkedIn', contactGitHub: 'GitHub',
      footerTagline: 'Full-Stack Engineer & DevOps Specialist crafting modern solutions with precision and innovation.',
      footerQuickLinks: 'Quick Links', footerTechStack: 'Tech Stack',
      footerFrontBack: 'Frontend & Backend', footerDatabases: 'Databases',
      footerCloud: 'Cloud & DevOps', footerTools: 'Tools & More',
      footerHome: 'Home', footerAbout: 'About', footerExperience: 'Experience', footerProjects: 'Projects',
      footerCopyright: '© 2026 Ghayth Selmi | Built, broken, fixed, and deployed .',
      footerStatus: 'System Online',
    },
    fr: {
      navHome: 'Accueil', navEducation: 'Formation', navAbout: 'À propos',
      navExperience: 'Expérience', navWork: 'Projets', navContact: 'Contact',
      navCta: 'Me contacter',
      heroBadge: 'Disponible',
      heroSubtitle: 'Ingénieur Full-Stack & DevOps',
      heroDesc: "Récemment diplômé de l'ESPRIT, avec une solide maîtrise du développement full-stack et du DevOps. Je construis des applications scalables et les déploie avec précision.",
      heroContact: 'Me contacter', heroCV: 'Télécharger CV',
      sectionEducation: 'Formation',
      edu1Degree: 'Ingénierie Cloud Computing', edu1School: 'ESPRIT', edu1Date: '2020 - 2025',
      edu2Degree: 'Baccalauréat Scientifique', edu2School: 'Lycée Pionnier de Gabès', edu2Date: '2015 - 2019',
      sectionAbout: 'À Propos',
      aboutIntro: "Je me spécialise dans le développement full-stack et le DevOps, avec de l'expérience dans la création d'applications de bout en bout et leur déploiement via des pratiques modernes de cloud et CI/CD. Je travaille aisément avec des frameworks frontend, des APIs backend, des bases de données et des environnements conteneurisés.",
      skill1Title: 'Développement Web', skill1Desc: 'Angular, Symfony, .NET, Spring Boot',
      skill2Title: 'Bases de Données', skill2Desc: 'MySQL, PostgreSQL, MongoDB',
      skill3Title: 'Cloud & DevOps', skill3Desc: 'Docker, Kubernetes, Jenkins, Nginx, SonarQube, Grafana, Prometheus, Ansible',
      sectionExperience: 'Expérience',
      exp1Title: 'Stagiaire Développeur Full Stack', exp1Company: 'Spofun', exp1Date: 'Fév 2025 - Août 2025',
      exp1li1: "Développement d'une plateforme de coaching sportif full-stack avec Angular et Spring Boot",
      exp1li2: "Implémentation d'APIs RESTful et fonctionnalités temps réel pour l'interaction athlète-coach",
      exp1li3: 'Mise en place de pipelines CI/CD avec Jenkins, Docker et Docker Compose',
      exp2Title: 'Stagiaire Développeur Full Stack', exp2Company: 'ChyrineProd', exp2Date: 'Juil 2024 - Sep 2024',
      exp2li1: "Développement d'une application web pour surveiller la disponibilité des sites et les certificats SSL",
      exp2li2: 'Conception et implémentation des interfaces réactives avec Angular',
      exp2li3: 'Implémentation des fonctionnalités côté serveur avec Symfony et MySQL',
      sectionCertifications: 'Certifications',
      sectionCertSubtitle: 'Certifications professionnelles démontrant une expertise dans les technologies cloud et les pratiques DevOps.',
      btnViewCert: ' Voir le Certificat', modalIssueDate: "Date d'émission",
      modalIssuer: 'Organisation émettrice', modalSkills: 'Compétences couvertes', btnVerify: 'Vérifier le Certificat',
      sectionWork: 'Projets Récents', sectionWorkSubtitle: 'Projets récents illustrant les capacités full-stack',
      btnViewProject: 'Voir le Projet', modalTech: 'Technologies', modalAbout: 'À propos', modalFeatures: 'Fonctionnalités',
      sectionContact: 'Me Contacter', sectionContactSubtitle: 'Ouvert aux collaborations et projets stimulants',
      contactEmail: 'Email', contactLinkedIn: 'LinkedIn', contactGitHub: 'GitHub',
      footerTagline: 'Ingénieur Full-Stack & Spécialiste DevOps, créant des solutions modernes avec précision et innovation.',
      footerQuickLinks: 'Liens Rapides', footerTechStack: 'Stack Technique',
      footerFrontBack: 'Frontend & Backend', footerDatabases: 'Bases de Données',
      footerCloud: 'Cloud & DevOps', footerTools: 'Outils & Plus',
      footerHome: 'Accueil', footerAbout: 'À Propos', footerExperience: 'Expérience', footerProjects: 'Projets',
      footerCopyright: '© 2026 Ghayth Selmi. Tous droits réservés. | Conçu & Développé avec ❤️ par Ghayth',
      footerStatus: 'Système en ligne',
    }
  };

  get lang(): T { return this.translations[this.currentLang]; }

  toggleLang(): void { this.currentLang = this.currentLang === 'en' ? 'fr' : 'en'; }

  chars(str: string): string[] { return str.split(''); }

  // ── Project details (bilingual) ──────────────────────────────
  projectDetails: { [key: string]: ProjectDetail } = {
    spofuncoach: {
      title: 'SpofunCoach',
      subtitle: 'Full-stack Sports Coaching Platform',
      category: 'Full-Stack Development & CI/CD',
      image: 'assets/spofuncoach.png',
      images: ['assets/spofuncoach.png', 'assets/Login .png'],
      description: 'SpofunCoach is an all-in-one sports coaching platform designed to connect athletes with certified professional coaches. It enables seamless session booking, real-time scheduling, secure online payments, and detailed performance tracking.',
      technologies: ['Angular','Spring Boot','PostgreSQL','Jhipster','Docker','Jenkins','Azure','SonarQube','Grafana','Prometheus','Git'],
      features: [
        'Real-time scheduling and calendar integration',
        'Video conferencing for remote coaching sessions',
        'Local payment method using coins',
        'Payment integration with secure transaction handling',
        'Mobile-responsive design for athletes on the go',
        'AI assistance ensuring easier use for clients',
        'Multi-language support (English, French)'
      ],
      liveUrl: 'http://spofuncoach.duckdns.org',
      githubUrl: 'https://github.com/ghaythselmi/spofuncoach'
    },
    webguardian: {
      title: 'Web Guardian',
      subtitle: 'Website Availability & SSL Monitoring System',
      category: 'Security & Web Monitoring',
      image: 'assets/work-2.png',
      description: 'Web Guardian is a web-based monitoring application designed to track website availability and SSL certificate validity. It provides real-time status checks, automated alerts, and a centralized dashboard.',
      technologies: ['Symfony','Angular','MySQL','Git'],
      features: [
        'Website uptime and availability monitoring',
        'SSL certificate status and expiration tracking',
        'Automated alerts for downtime and SSL issues',
        'Responsive and optimized user interface',
        'Dashboard with real-time monitoring status',
        'Server-side logic and database integration',
        'Secure data handling and user authentication'
      ],
      liveUrl: 'https://webguardian-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/webguardian'
    },
    espritcollab: {
      title: 'EspritCollab',
      subtitle: 'Student Collaboration & Problem-Solving Platform',
      category: 'Educational Technology & Cloud',
      image: 'assets/work-3.png',
      description: 'EspritCollab is a collaborative web platform designed to help students work together, manage projects, and solve academic problems efficiently. Fully deployed on cloud infrastructure using OpenStack with containerized services.',
      technologies: ['Spring Boot','Angular','MySQL','Docker','Kubernetes','OpenStack','Git','UML'],
      features: [
        'Collaborative project and task management',
        'Shared workspaces for student teams',
        'RESTful API services for platform operations',
        'Responsive and user-friendly interface',
        'Centralized data management with MySQL',
        'Containerized backend and frontend using Docker',
        'Orchestration and scaling with Kubernetes',
        'Deployment on virtual machines using OpenStack'
      ],
      liveUrl: 'https://espritcollab-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/espritcollab'
    },
    docnet: {
      title: 'DocNet',
      subtitle: 'Online Medical Appointment Booking Platform',
      category: 'Healthcare & Web Applications',
      image: 'assets/work-4.png',
      description: 'DocNet is a healthcare web platform that enables patients to book medical appointments with doctors online. It supports appointment scheduling, user management, and secure data handling.',
      technologies: ['Symfony','Java','JavaFX','MySQL','Git','UML'],
      features: [
        'Online appointment booking for patients',
        'Doctor availability and schedule management',
        'Patient and doctor account management',
        'REST API development and backend logic',
        'User-friendly interfaces built with JavaFX',
        'Secure database integration with MySQL',
        'System analysis and UML-based design',
        'CRUD operations for medical data management'
      ],
      liveUrl: 'https://docnet-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/docnet'
    }
  };

  projectDetailsFr: { [key: string]: ProjectDetail } = {
    spofuncoach: {
      title: 'SpofunCoach',
      subtitle: 'Plateforme de Coaching Sportif Full-Stack',
      category: 'Développement Full-Stack & CI/CD',
      image: 'assets/spofuncoach.png',
      images: ['assets/spofuncoach.png', 'assets/Login .png'],
      description: "SpofunCoach est une plateforme de coaching sportif tout-en-un conçue pour connecter les athlètes avec des coachs professionnels certifiés. Elle permet la réservation de séances, la planification en temps réel, les paiements en ligne sécurisés et le suivi détaillé des performances.",
      technologies: ['Angular','Spring Boot','PostgreSQL','Jhipster','Docker','Jenkins','Azure','SonarQube','Grafana','Prometheus','Git'],
      features: [
        'Planification en temps réel et intégration calendrier',
        'Visioconférence pour les séances de coaching à distance',
        'Méthode de paiement locale par jetons',
        'Intégration des paiements avec gestion sécurisée des transactions',
        'Design responsive pour les athlètes en déplacement',
        "Assistance IA pour une utilisation simplifiée",
        'Support multilingue (anglais, français)'
      ],
      liveUrl: 'http://spofuncoach.duckdns.org',
      githubUrl: 'https://github.com/ghaythselmi/spofuncoach'
    },
    webguardian: {
      title: 'Web Guardian',
      subtitle: 'Système de Surveillance de Disponibilité & SSL',
      category: 'Sécurité & Surveillance Web',
      image: 'assets/work-2.png',
      description: "Web Guardian est une application de surveillance web conçue pour suivre la disponibilité des sites et la validité des certificats SSL. Elle fournit des vérifications en temps réel, des alertes automatisées et un tableau de bord centralisé pour détecter proactivement les pannes et risques de sécurité.",
      technologies: ['Symfony','Angular','MySQL','Git'],
      features: [
        'Surveillance de la disponibilité et du temps de fonctionnement',
        'Suivi du statut et de l\'expiration des certificats SSL',
        'Alertes automatisées pour les pannes et problèmes SSL',
        'Interface utilisateur responsive et optimisée',
        'Tableau de bord avec statut de surveillance en temps réel',
        'Logique serveur et intégration base de données',
        'Gestion sécurisée des données et authentification'
      ],
      liveUrl: 'https://webguardian-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/webguardian'
    },
    espritcollab: {
      title: 'EspritCollab',
      subtitle: 'Plateforme de Collaboration Étudiante',
      category: 'Technologies Éducatives & Cloud',
      image: 'assets/work-3.png',
      description: "EspritCollab est une plateforme web collaborative conçue pour aider les étudiants à travailler ensemble, gérer des projets et résoudre des problèmes académiques efficacement. Entièrement déployée sur une infrastructure cloud OpenStack avec des services conteneurisés.",
      technologies: ['Spring Boot','Angular','MySQL','Docker','Kubernetes','OpenStack','Git','UML'],
      features: [
        'Gestion collaborative de projets et de tâches',
        'Espaces de travail partagés pour les équipes étudiantes',
        'Services API RESTful pour les opérations de la plateforme',
        'Interface responsive et conviviale',
        'Gestion centralisée des données avec MySQL',
        'Backend et frontend conteneurisés avec Docker',
        'Orchestration et mise à l\'échelle avec Kubernetes',
        'Déploiement sur machines virtuelles OpenStack'
      ],
      liveUrl: 'https://espritcollab-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/espritcollab'
    },
    docnet: {
      title: 'DocNet',
      subtitle: 'Plateforme de Prise de Rendez-vous Médicaux',
      category: 'Santé & Applications Web',
      image: 'assets/work-4.png',
      description: "DocNet est une plateforme web de santé permettant aux patients de prendre des rendez-vous médicaux en ligne. Le système gère la planification des rendez-vous, la gestion des utilisateurs et le traitement sécurisé des données.",
      technologies: ['Symfony','Java','JavaFX','MySQL','Git','UML'],
      features: [
        'Prise de rendez-vous en ligne pour les patients',
        'Gestion des disponibilités et emplois du temps des médecins',
        'Gestion des comptes patients et médecins',
        'Développement API REST et logique backend',
        'Interfaces conviviales développées avec JavaFX',
        'Intégration sécurisée de base de données MySQL',
        'Analyse système et conception UML',
        'Opérations CRUD pour la gestion des données médicales'
      ],
      liveUrl: 'https://docnet-demo.example.com',
      githubUrl: 'https://github.com/ghaythselmi/docnet'
    }
  };

  certificateDetails: { [key: string]: any } = {
    az900: {
      title: 'Introduction to Microsoft Azure Cloud Services',
      titleFr: 'Introduction aux services cloud Microsoft Azure',
      category: 'Azure Certification',
      categoryFr: 'Certification Azure',
      image: 'assets/Coursera 1.jpg',
      issueDate: 'November 2024',
      issueDateFr: 'Novembre 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/028LA5J32Y86',
      skills: ['Cloud Concepts','Azure Services','Microsoft Azure','Cloud Services','Cloud Deployment Models','Azure Architecture'],
      skillsFr: ['Concepts Cloud','Services Azure','Microsoft Azure','Services Cloud','Modèles de Déploiement','Architecture Azure']
    },
    az104: {
      title: 'Microsoft Azure Services and Lifecycles',
      titleFr: 'Services et Cycles de Vie Microsoft Azure',
      category: 'Azure Certification',
      categoryFr: 'Certification Azure',
      image: 'assets/Coursera 2.jpg',
      issueDate: 'December 2024',
      issueDateFr: 'Décembre 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/2I43RNV8ORRG',
      skills: ['Azure Identity & Governance','Infrastructure As A Service (IaaS)','Single Sign-On (SSO)','Software As A Service','Cloud Security','Identity and Access Management'],
      skillsFr: ['Identité & Gouvernance Azure','Infrastructure en tant que Service (IaaS)','Authentification unique (SSO)','Logiciel en tant que Service','Sécurité Cloud','Gestion des Identités et Accès']
    },
    az400: {
      title: 'Microsoft Azure Management Tools and Security Solutions',
      titleFr: 'Outils de Gestion et Solutions de Sécurité Microsoft Azure',
      category: 'Azure Certification',
      categoryFr: 'Certification Azure',
      image: 'assets/Coursera 3.jpg',
      issueDate: 'November 2024',
      issueDateFr: 'Novembre 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/ZC0PSAW4W31B',
      skills: ['Serverless Computing','DDoS Attacks','Network Security','Security & Compliance','Monitoring & Feedback','System Monitoring'],
      skillsFr: ['Informatique Sans Serveur','Attaques DDoS','Sécurité Réseau','Sécurité & Conformité','Surveillance & Retours','Surveillance Système']
    }
  };

  get activeProjectDetails() {
    return this.currentLang === 'en' ? this.projectDetails : this.projectDetailsFr;
  }

  getCertField(certId: string, field: string): any {
    const cert = this.certificateDetails[certId];
    if (!cert) return '';
    if (this.currentLang === 'fr') {
      const frField = field + 'Fr';
      return cert[frField] ?? cert[field];
    }
    return cert[field];
  }

  ngOnInit(): void { this.setupMobileMenu(); }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = (window.pageYOffset || document.documentElement.scrollTop || 0) > 50;
  }

  openProjectDetails(projectId: string): void {
    this.selectedProject = projectId;
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }

  openCertificate(certificateId: string): void {
    this.selectedCertificate = certificateId;
    document.body.style.overflow = 'hidden';
  }

  closeCertificate(): void {
    this.selectedCertificate = null;
    document.body.style.overflow = 'auto';
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = 'assets/_CV_Ghayth_Selmi.pdf';
    link.download = 'Ghayth_Selmi_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private setupMobileMenu(): void {
    if (!this.hamburger || !this.navMenu) return;
    const hamburger = this.hamburger.nativeElement;
    const navMenu = this.navMenu.nativeElement;
    hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
    navMenu.querySelectorAll('a').forEach((link: HTMLElement) => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!hamburger.contains(target) && !navMenu.contains(target)) navMenu.classList.remove('active');
    });
  }

  objectKeys(obj: any): string[] { return Object.keys(obj); }
}
