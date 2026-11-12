# TRABAJO-FINAL---TUPAD

## Integrante
- Grupo: 210
- Alumno: Palacios Fernando Agustin
- Tutor a cargo: Gerardo Adrian Herrera

## Introducción
El siguiente Trabajo Final de la carrera Tecnicatura Universitaria en Programacion a Distancia consiste en el desarrollo de un sistema de gestión de turnos para una institución de salud, diseñado para facilitar la organización y administración de las citas entre pacientes y profesionales.
Poniendo en practica los conocimeintos y herramientas adquiridos durante la cursada, integrando diferentes conceptos de frontend, backend y base de datos.

### Problematica
En clínicas y centros de salud de escala pequeña o mediana, la gestión de turnos suele resolverse todavía de forma manual: planillas de cálculo, agendas físicas por profesional y coordinación telefónica entre recepción y pacientes. Esta forma de trabajo depende en gran parte del criterio y la disponibilidad del personal administrativo, que debe consultar distintas fuentes de información para saber qué horarios están realmente libres en cada momento.

### Solucion a plantear
Se propone el desarrollo de una aplicación web que centralice la gestión de turnos de la clínica en una única plataforma accesible desde cualquier dispositivo con conexión a internet, eliminando la dependencia de planillas dispersas y comunicación telefónica como única vía de coordinación.



## Estructura del proyecto
```
gestion-turnos/
├── backend/                      # API REST en Node.js + TypeScript
│   ├── prisma/
│   │   └── schema.prisma         # Esquema de base de datos relacional
│   ├── src/
│   │   ├── controllers/          # Controladores
│   │   ├── services/             # Lógica de negocio y reglas de turnos
│   │   ├── routes/               # Rutas y endpoints
│   │   ├── middlewares/          # Manejo de errores
│   │   ├── types/                # Interfaces y tipos TypeScript
│   │   ├── config/               # Configuración de base de datos y variables
│   │   └── index.ts              # Entrada al servidor
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # Aplicación React + Vite con CSS
│   ├── src/
│   │   ├── assets/               # Imágenes, logos e iconos
│   │   ├── config/
│   │   │   └── clinicaConfig.js  # Identidad y textos institucionales del frontend
│   │   ├── components/           # Componentes reutilizables con sus estilos
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Calendar/
│   │   │   │   ├── Calendar.jsx
│   │   │   │   └── Calendar.css
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   └── ModalTurno/
│   │   │       ├── ModalTurno.jsx
│   │   │       └── ModalTurno.css
│   │   ├── views/                # Vistas principales
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Home.css
│   │   │   ├── ReservaTurno/
│   │   │   │   ├── ReservaTurno.jsx
│   │   │   │   └── ReservaTurno.css
│   │   │   ├── PanelMedico/
│   │   │   └── Login/
│   │   ├── services/             # Peticiones HTTP a la API
│   │   ├── styles/               # Estilos globales y diseño del sistema
│   │   │   ├── variables.css     # Colores de la clínica, fuentes, espaciados
│   │   │   ├── reset.css         # Reseteo de márgenes y box-sizing
│   │   │   └── global.css        # Tipografías base y estilos comunes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── database/                     # Scripts y documentación
│   ├── ddl/
│   │   └── 01_create_tables.sql  # Creación de tablas, claves foráneas e índices
│   └── dml/
│       └── 02_initial_seeds.sql  # Inserción de especialidades, admin y roles
│
├── docs/                         # Informes y documentación
│
├── .gitignore
└── README.md                     # Documentación principal del repositorio
```


## Tecnologias a utilizar

- Frontend: Javascript/Typescript, React, HTML y CSS
- Backend: Typescript
- Base de datos: MySQL
- Despliegue del frontend: Vercel
- Despliegue del backend: Railway

El stack tecnologico propuesto son herramientas vistas durante la cursada de la carrera, pero como equipo tambien contemplamos la posibilidad de ajustar alguna tecnologia sobre la marcha si surge alguna necesitad en concreto.

## Desarrollo por Etapas

### Etapa 1: Núcleo Operativo, Autenticación y Reserva Online 

* **Módulo de Autenticación y Seguridad (Auth):**
  * Registro de pacientes y acceso mediante credenciales (email y contraseña).
  * Control de acceso basado en roles para perfiles: `PACIENTE`, `MEDICO` y `ADMIN`.
  * Protección de rutas y persistencia de sesión en el frontend con `AuthContext` y `ProtectedRoute`.

* **Módulo de Pacientes (Autogestión):**
  * Búsqueda parametrizada cruzando especialidad, profesional, fecha y cobertura médica habilitada.
  * Selección y reserva de franjas horarias libres calculadas en tiempo real.
  * Panel "Mis Turnos": consulta de citas agendadas e historial, cancelación autónoma con liberación inmediata de cupo.
 

* **Módulo de Profesionales Médicos:**
  * Visualización de agenda de turnos agendados.
  * Configuración de rutina horaria semanal: definición de días laborales, horarios de atención y duración estándar por consulta (ej. 15, 30, 45 min).

* **Módulo de Excepciones y Bloqueos de Agenda:**
  * Registro y gestión de ausencias programadas o imprevistas (licencias, feriados, vacaciones).
  * Exclusión automática de franjas horarias bloqueadas en el motor de búsqueda y reserva.

* **Módulo de Obras Sociales y Coberturas:**
  * Catálogo centralizado de obras sociales, prepagas y modalidad Particular.


* **Módulo de Administración y Mesa de Entrada:**
  * ABM (CRUD) integral de médicos, especialidades, consultorios físicos y coberturas.
  * Mesa de entrada: búsqueda de pacientes por DNI y asignación de turnos presenciales o telefónicos.
  * Panel básico con métricas de ocupación y turnos asignados por especialidad.

---

### Etapa 2: Recordatorios, Notificaciones y Optimización Operativa 

* **Sistema de Recordatorios y Notificaciones:**
  * Envío programado de alertas previas al turno por correo electrónico.
  * Notificaciones por correo electrónico de cancelación o reprogramación de turnos emitidas al instante para el paciente o el médico.


---

## Escalabilidad y funcionalidades futuras

Las siguientes propuestas representan funcionalidades futuras para la evolución del sistema.

* **Chatbot asistencial para pacientes:** Asistente virtual integrado en el frontend para responder consultas frecuentes sobre horarios de atención, especialidades y requisitos de coberturas.
  * Consulta guiada de disponibilidad en lenguaje natural, con derivación al flujo habitual de reserva.
* **Notificaciones, recordatorios:** Incorporación de mensajería instantánea (WhatsApp Business API) y notificaciones push para recordatorios automáticos.
* **Lista de espera inteligente:** sistema de lista de espera que reasigne de forma ágil los cupos liberados por cancelaciones de último momento.
* **Integración de documentos administrativos:** Carga previa de órdenes médicas digitales para agilizar la validación administrativa en ventanilla.
* **Historia Clínica Electrónica y documentación del paciente:** Registro estructurado de evoluciones médicas, diagnósticos, antecedentes, y prescripciones asociados a cada consulta atendida.
* **Escalabilidad de la infraestructura:** incorporar monitoreo, registros centralizados y estrategias de respaldo; optimizar consultas y recursos a medida que aumente el volumen de usuarios y turnos.
* **Seguridad avanzada y auditoría:** Implementación de autenticación en dos pasos (2FA) para cuentas administrativas y bitácoras de auditoría sobre modificaciones críticas de agendas y turnos.
* **Reportes operativos:** ampliar las métricas para analizar demanda, ocupación y ausentismo, con filtros y exportación de resultados.

## Utilización de inteligencia artificial

Se utilizó inteligencia artificial generativa como herramienta de apoyo durante el desarrollo del proyecto, principalmente para explorar alternativas de solución, resolver dudas técnicas y mejorar la redacción y organización de la documentación. Su uso permitió acelerar la búsqueda de ideas y contar con sugerencias para analizar e iterar sobre el sistema.

Los modelos utilizados fueron **Claude Sonnet 5.5** y **Gemini 4 Argon**.

La IA se empleó como complemento del trabajo, no como sustituto de las decisiones del equipo: las propuestas se revisaron y ajustaron según los requerimientos del proyecto. Entre las ventajas obtenidas se destacan el ahorro de tiempo en tareas de investigación, redacción y escritura de código, la generación rápida de alternativas y una mayor facilidad para identificar posibles mejoras.



