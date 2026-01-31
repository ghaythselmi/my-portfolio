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

  projectDetails: { [key: string]: ProjectDetail } = {
    spofuncoach: {
      title: 'SpofunCoach',
      subtitle: 'Full-stack Sports Coaching Platform',
      category: 'Full-Stack Development',
      image: 'assets/work-1.png',
      description: 'SpofunCoach is a comprehensive sports coaching platform that connects athletes with professional coaches. The platform features real-time scheduling, progress tracking, personalized workout plans, and integrated video conferencing for remote coaching sessions. Built with a microservices architecture for scalability and reliability.',
      technologies: ['Angular', 'Spring Boot', 'MySQL', 'Docker', 'Kubernetes', 'WebRTC', 'Redis'],
      features: [
        'Real-time scheduling and calendar integration',
        'Video conferencing for remote coaching sessions',
        'Progress tracking with detailed analytics and charts',
        'Personalized workout plans and nutrition tracking',
        'Payment integration with secure transaction handling',
        'Mobile-responsive design for athletes on the go',
        'Push notifications for session reminders',
        'Multi-language support (English, French, Arabic)'
      ],
      liveUrl: 'https://spofuncoach-demo.example.com',
      githubUrl: 'https://github.com/yourusername/spofuncoach'
    },
    webguardian: {
      title: 'Web Guardian',
      subtitle: 'Cybersecurity Monitoring System',
      category: 'Security & DevOps',
      image: 'assets/work-2.png',
      description: 'Web Guardian is an advanced cybersecurity monitoring platform that provides real-time threat detection, automated vulnerability scanning, and comprehensive security reporting. The system uses machine learning algorithms to identify potential threats and provides automated responses to common security incidents.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'Docker', 'Grafana', 'Prometheus'],
      features: [
        'Real-time threat detection and monitoring',
        'Automated vulnerability scanning and assessment',
        'Machine learning-based anomaly detection',
        'Comprehensive security audit reports',
        'Integration with popular DevOps tools (Jenkins, GitLab)',
        'Custom alert rules and notifications',
        'Interactive security dashboard with live metrics',
        'Compliance reporting (ISO 27001, GDPR)'
      ],
      liveUrl: 'https://webguardian-demo.example.com',
      githubUrl: 'https://github.com/yourusername/webguardian'
    },
    espritcollab: {
      title: 'EspritCollab',
      subtitle: 'Student Collaboration Platform',
      category: 'Educational Technology',
      image: 'assets/work-3.png',
      description: 'EspritCollab is a collaborative workspace designed specifically for students to manage projects, share files, and communicate in real-time. The platform includes project management tools, version control integration, and real-time collaboration features to enhance teamwork and productivity.',
      technologies: ['Angular', 'Symfony', 'PostgreSQL', 'Redis', 'Elasticsearch', 'WebSocket', 'Docker'],
      features: [
        'Project and task management with Kanban boards',
        'Real-time collaborative document editing',
        'File sharing with version control',
        'Integrated chat and video conferencing',
        'Assignment submission and grading system',
        'Code collaboration with syntax highlighting',
        'Team performance analytics and insights',
        'Integration with popular dev tools (Git, VS Code)'
      ],
      liveUrl: 'https://espritcollab-demo.example.com',
      githubUrl: 'https://github.com/yourusername/espritcollab'
    },
    docnet: {
      title: 'DocNet',
      subtitle: 'Document Management System',
      category: 'Enterprise Software',
      image: 'assets/work-4.png',
      description: 'DocNet is an enterprise-grade document management system featuring advanced version control, secure document sharing, and powerful search capabilities. The system supports multiple document formats, provides OCR functionality, and includes workflow automation for document approval processes.',
      technologies: ['.NET Core', 'Angular', 'SQL Server', 'Elasticsearch', 'Azure Blob Storage', 'SignalR', 'Docker'],
      features: [
        'Advanced version control and document history',
        'OCR (Optical Character Recognition) for scanned documents',
        'Powerful full-text search with filters',
        'Role-based access control and permissions',
        'Document workflow automation and approval chains',
        'Electronic signature integration',
        'Audit trails and compliance reporting',
        'Multi-format support (PDF, DOCX, XLSX, images)'
      ],
      liveUrl: 'https://docnet-demo.example.com',
      githubUrl: 'https://github.com/yourusername/docnet'
    }
  };

  ngOnInit(): void {
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
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
}