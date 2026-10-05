import type { Answer } from "@/domain/chat/answer";

export const PROFILE_ANSWERS: Answer[] = [
  {
    topic: "identity",
    question: "¿Quién es Alejandro Ávila?",
    body:
      "Alejandro Ávila es un ingeniero mecatrónico y desarrollador full-stack senior radicado " +
      "en Bogotá, Colombia, con seis años de experiencia construyendo plataformas de banca digital.",
    keywords: ["quien", "alejandro", "avila", "perfil", "about", "sobre"],
  },
  {
    topic: "experience",
    question: "¿Cuántos años de experiencia tiene?",
    body:
      "Seis años en desarrollo de software, todos en banca digital, precedidos por cinco años " +
      "en mantenimiento y automatización industrial.",
    keywords: ["anos", "años", "experiencia", "tiempo", "trayectoria", "senior", "years"],
  },
  {
    topic: "frontend",
    question: "¿Qué experiencia tiene en frontend?",
    body:
      "Trabaja frontend a escala con arquitectura de microfrontends en Angular con Module " +
      "Federation, Web Components y librerías de UI compartidas entre equipos. También usa " +
      "React y Next.js, que es con lo que está hecho este sitio.",
    keywords: [
      "frontend", "angular", "react", "next", "microfrontend", "microfrontends",
      "federation", "componentes", "component", "web", "stencil", "ui",
    ],
  },
  {
    topic: "backend",
    question: "¿Qué experiencia tiene en backend?",
    body:
      "Construye microservicios en NestJS y TypeScript sobre arquitectura hexagonal, " +
      "documentados con OpenAPI y cubiertos con pruebas en Jest.",
    keywords: [
      "backend", "nestjs", "nest", "node", "api", "microservicio", "microservicios",
      "hexagonal", "openapi", "jest", "typescript",
    ],
  },
  {
    topic: "infrastructure",
    question: "¿Qué experiencia tiene en infraestructura?",
    body:
      "Gestiona infraestructura como código en Terraform sobre AWS y GCP, con despliegues " +
      "multi-ambiente y pipelines de integración y entrega continua.",
    keywords: [
      "infraestructura", "infra", "terraform", "iac", "devops", "pipeline",
      "pipelines", "despliegue", "deploy", "ci", "cd",
    ],
  },
  {
    topic: "cloud",
    question: "¿Qué experiencia tiene en cloud?",
    body:
      "Experiencia profesional en AWS, incluyendo Lambda@Edge, DynamoDB y RDS; y en Google " +
      "Cloud con Cloud Run, Firestore y Firebase Hosting en proyectos propios.",
    keywords: [
      "cloud", "nube", "aws", "gcp", "google", "lambda", "dynamodb", "rds",
      "firestore", "firebase", "run",
    ],
  },
  {
    topic: "industry",
    question: "¿En qué industria trabaja?",
    body:
      "En banca digital, específicamente en originación y desembolso de crédito empresarial. " +
      "Son entornos regulados donde la trazabilidad y el permiso mínimo son condiciones de entrada.",
    keywords: [
      "industria", "sector", "dominio", "banca", "banco", "fintech", "credito",
      "financiero", "regulado",
    ],
  },
  {
    topic: "education",
    question: "¿Qué formación tiene?",
    body:
      "Es Ingeniero Mecatrónico de la Corporación Tecnológica Industrial Colombiana (TEINCO), " +
      "graduado en 2019, y se mantiene actualizado con formación continua en desarrollo, " +
      "inteligencia artificial y cloud.",
    keywords: [
      "formacion", "estudio", "estudios", "titulo", "carrera", "universidad",
      "mecatronico", "mecatronica", "teinco", "ingeniero", "education",
    ],
  },
  {
    topic: "languages",
    question: "¿Habla inglés?",
    body:
      "Español nativo. Inglés nivel B1: lectura y escritura técnica, conversacional en progreso.",
    keywords: ["ingles", "english", "idioma", "idiomas", "espanol", "nivel", "habla"],
  },
  {
    topic: "availability",
    question: "¿Está disponible para trabajo remoto?",
    body:
      "Sí, está abierto a posiciones remotas de Senior Full-Stack o Platform Engineer desde " +
      "Bogotá, Colombia. Puedes escribirle a alejandroavilaguerrero@gmail.com.",
    keywords: [
      "remoto", "disponible", "disponibilidad", "contratar", "contacto", "correo",
      "vacante", "trabajo", "remote", "hiring",
    ],
  },
  {
    topic: "site",
    question: "¿Cómo está hecho este sitio?",
    body:
      "Con Next.js exportado como sitio estático en Firebase Hosting, un widget en Angular " +
      "cargado en runtime, un API en NestJS sobre Cloud Run e infraestructura definida en " +
      "Terraform. Todo dentro de la capa gratuita de Google Cloud, con despliegue autenticado " +
      "por identidad federada y sin llaves de larga vida. Este chat es el widget.",
    keywords: [
      "sitio", "pagina", "web", "hecho", "construido", "arquitectura", "stack",
      "widget", "chat", "portafolio", "site",
    ],
  },
];
