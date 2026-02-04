import { Component, OnInit, HostListener } from '@angular/core';

interface ProjectDetail {
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  technologies: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isDarkMode = false;
  isMobileMenuOpen = false;
  selectedProject: string | null = null;
  isScrolled = false;
  selectedCertificate: string | null = null;


  projectDetails: { [key: string]: ProjectDetail } = {
    spofuncoach: {
      title: 'SpofunCoach',
      subtitle: 'Full-stack Sports Coaching Platform',
      category: 'Full-Stack Development and Deployment automation',
      image: 'assets/spofuncoach.png',
      description: 'SpofunCoach is an all-in-one sports coaching platform designed to connect athletes with certified professional coaches. It enables seamless session booking, real-time scheduling, secure online payments, and detailed performance tracking. The platform empowers athletes to monitor their progress while giving coaches powerful tools to manage clients, sessions, and training plans—all in one place. ',
      technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Jhipster', 'Docker', 'Jenkins', 'Azure', 'SonarQube', 'Grafana', 'Prometheus','Git'],
      features: [
        'Real-time scheduling and calendar integration',
        'Video conferencing for remote coaching sessions',
        'Local payment method using coins',
        'Payment integration with secure transaction handling',
        'Mobile-responsive design for athletes on the go',
        'AI assistance ensuring easier use for clients',
        'Multi-language support (English, French)'
      ],
      liveUrl: 'https://spofuncoach-demo.example.com',
      githubUrl: 'https://github.com/yourusername/spofuncoach'
    },
    webguardian: {
      title: 'Web Guardian',
      subtitle: 'Website Availability & SSL Monitoring System',
      category: 'Security & Web Monitoring',
      image: 'assets/work-2.png',
      description: 'Web Guardian is a web-based monitoring application designed to track website availability and SSL certificate validity. It provides real-time status checks, automated alerts, and a centralized dashboard to help users proactively detect downtime and security risks related to expired or misconfigured SSL certificates and servers.',
      technologies: ['Symfony', 'Angular', 'MySQL', 'Git'],
      features: [
        'Website uptime and availability monitoring',
        'SSL certificate status and expiration tracking',
        'Automated alerts for downtime and SSL issues',
        'Responsive and optimized user interface',
        'Dashboard with real-time monitoring status',
        'Server-side logic and database integration',
        'Secure data handling and user authentication'
      ],
      liveUrl: "null",
      githubUrl: 'https://github.com/yourusername/webguardian'
    },
    
   espritcollab: {
  title: 'EspritCollab',
  subtitle: 'Student Collaboration & Problem-Solving Platform',
  category: 'Educational Technology & Cloud',
  image: 'assets/work-3.png',
  description: 'EspritCollab is a collaborative web platform designed to help students work together, manage projects, and solve academic problems efficiently. The application provides shared workspaces, task coordination, and communication features, and is fully deployed on cloud infrastructure using OpenStack with containerized services.',
  technologies: [
    'Spring Boot',
    'Angular',
    'MySQL',
    'Docker',
    'Kubernetes',
    'OpenStack',
    'Git',
    'UML'
  ],
  features: [
    'Collaborative project and task management',
    'Shared workspaces for student teams',
    'RESTful API services for platform operations',
    'Responsive and user-friendly interface',
    'Centralized data management with MySQL',
    'Containerized backend and frontend using Docker',
    'Orchestration and scaling with Kubernetes',
    'Deployment on virtual machines using OpenStack services'
  ],
  liveUrl: "null",
  githubUrl: 'https://github.com/yourusername/espritcollab'
}
,
docnet: {
  title: 'DocNet',
  subtitle: 'Online Medical Appointment Booking Platform',
  category: 'Healthcare & Web Applications',
  image: 'assets/work-4.png',
  description: 'DocNet is a healthcare web platform that enables patients to book medical appointments with doctors online. The system supports appointment scheduling, user management, and secure data handling. The project involved full analysis and design, backend API development, user interface implementation, and database integration.',
  technologies: [
    'Symfony',
    'Java',
    'JavaFX',
    'MySQL',
    'Git',
    'UML'
  ],
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
  liveUrl: "null",
  githubUrl: 'https://github.com/yourusername/docnet'
}

  };


  certificateDetails: any = {
    az900: {
      title: 'Introduction to Microsoft Azure Cloud Services',
      category: 'Azure Certification',
      code: 'Microsoft',
      image: 'assets/Coursera 1.jpg',
      issueDate: 'Novembre 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/028LA5J32Y86',
      skills: [
        'Cloud Concepts',
        'Azure Services',
        'Microsoft Azure',
        'Cloud Services',
        'Cloud Deployment Models',
        'Azure Architecture'
      ]
    },
    az104: {
      title: 'Microsoft Azure Services and Lifecycles',
      category: 'Azure Certification',
      code: 'Microsoft',
      image: 'assets/Coursera 2.jpg', 
      issueDate: 'December 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/2I43RNV8ORRG',
      skills: [
        'Azure Identity & Governance',
        'Infrastructure As A Service (IaaS)',
        'Single Sign-On (SSO)',
        'Software As A Service',
        'Cloud Security',
        'Identity and Access Management'
      ]
    },
    az400: {
      title: 'Microsoft Azure Management Tools and Security Solutions',
      category: 'Azure Certification',
      code: 'Microsoft',
      image: 'assets/Coursera 3.jpg',
      issueDate: 'November 2024',
      issuer: 'Microsoft',
      verifyUrl: 'https://www.coursera.org/account/accomplishments/certificate/ZC0PSAW4W31B',
      skills: [
        'Serverless Computing',
        'Distributed Denial-Of-Service (DDoS) Attacks',
        'Network Security',
        'Security & Compliance',
        'Monitoring & Feedback',
        'System Monitoring'
      ]
    }
  };

  ngOnInit(): void {
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    this.setupFooterObserver();
    this.initFooterParticles()
  }

  // Listen to scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  openMenu(): void {
    this.isMobileMenuOpen = true;
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.style.right = '0';
    }
  }

  closeMenu(): void {
    this.isMobileMenuOpen = false;
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.style.right = '-16rem';
    }
  }

  scrollTo(section: string): void {
    this.closeMenu();
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  openProjectDetails(projectId: string): void {
    this.selectedProject = projectId;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails(): void {
    this.selectedProject = null;
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
  }

  downloadCV(): void {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = 'assets/_CV Ghayth Selmi .pdf'; // Make sure this path points to your actual CV file
    link.download = 'Ghayth_Selmi_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private setupFooterObserver(): void {
    const footerElement = document.querySelector('footer');
    
    if (footerElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Footer is visible - you can trigger analytics here
              console.log('Footer viewed');
            }
          });
        },
        { threshold: 0.5 }
      );
      
      observer.observe(footerElement);
    }
  }

  private initFooterParticles(): void {
    const footer = document.querySelector('footer');
    
    if (footer) {
      footer.addEventListener('mouseenter', () => {
        // Add extra animation class for enhanced effect
        footer.classList.add('footer-active');
      });
      
      footer.addEventListener('mouseleave', () => {
        footer.classList.remove('footer-active');
      });
    }
  }
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }



  // Certificate methods (new)
  openCertificate(certificateId: string): void {
    this.selectedCertificate = certificateId;
    document.body.style.overflow = 'hidden';
  }

  closeCertificate(): void {
    this.selectedCertificate = null;
    document.body.style.overflow = 'auto';
  }
}